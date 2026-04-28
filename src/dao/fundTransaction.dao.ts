import { FundTransactionDTO, FundTransaction, SavingsFund } from "../types";
import pool from "../database";
import { FundTransactionQueries } from "../queries/fundTransaction.queries";
import { SavingsFundQueries } from "../queries/savingsFund.queries";
import { AppError } from "../utils/AppError";

// Data access layer for savings fund transaction database operations.
export class FundTransactionDAO{
    // Updates the fund balance and inserts a new transaction row in a single transaction.
    async createFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO): Promise<FundTransaction>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');//begin the transaction
            const amount = fundTransactionDTO.transactionType === 'contribution' ? fundTransactionDTO.amount : - fundTransactionDTO.amount;

            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [amount, userId, fundTransactionDTO.savingsFundId]);
            const result = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, fundTransactionDTO.savingsFundId, fundTransactionDTO.transactionType, fundTransactionDTO.amount, fundTransactionDTO.description, fundTransactionDTO.transactionDate, fundTransactionDTO.month]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch(error){ //if anything in the transaction fails, the trnasaction is nullified and the state returns to pre-transaction
            await client.query('ROLLBACK');
            console.error('Failed to create transaction', error);
            throw error;
        } finally{
            client.release();
        }
    }

    // Returns all transaction rows for a specific fund.
    async findFundTransactions(userId: number, fundId: number): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTIONS, [userId, fundId]);
        return result.rows;
    }

    // Returns all transaction rows across all active funds for the user.
    async findAllTransactionsForActiveFunds(userId: number): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_ALL_TRANSACTIONS_FOR_ACTIVE_FUNDS, [userId]);
        return result.rows;
    }

    // Returns all transaction rows across all active funds for the user for a given month.
    async findMonthlyTransactionsForActiveFunds(userId: number, month: string): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_MONTHLY_TRANSACTIONS_FOR_ACTIVE_FUNDS, [userId, month]);
        return result.rows;
    }

    // Returns a single transaction row by its ID within a specific fund.
    async findFundTransactionById(userId: number, id: number, savingsFundId: number): Promise<FundTransaction>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTION_BY_ID, [userId, id, savingsFundId]);
        return result.rows[0];
    }

    // Returns all transaction rows for a fund filtered by month.
    async findFundTransactionsForMonth(userId: number, savingsFundId: number, month: string): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTIONS_BY_MONTH, [userId, savingsFundId, month]);
        return result.rows;
    }

    // Reverses the original transaction's balance effect, applies the new one, and updates the row in a single transaction.
    async updateFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO){
        const client = await pool.connect();
        try{
            await client.query('BEGIN');//begin the transaction
            const originalTransaction = (await client.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTION_BY_ID, [userId, fundTransactionDTO.id, fundTransactionDTO.savingsFundId])).rows[0];
            const reverseAmount = originalTransaction.transactionType === 'expenditure' ? originalTransaction.amount : -originalTransaction.amount;
            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [reverseAmount, userId, originalTransaction.savingsFundId]);
            const newAmount = fundTransactionDTO.transactionType === 'contribution' ? fundTransactionDTO.amount : -fundTransactionDTO.amount;

            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [newAmount, userId, fundTransactionDTO.savingsFundId]);

            const result = await client.query<FundTransaction>(FundTransactionQueries.UPDATE_FUND_TRANSACTION, [fundTransactionDTO.transactionType, fundTransactionDTO.amount, fundTransactionDTO.description, fundTransactionDTO.transactionDate, fundTransactionDTO.month, userId, fundTransactionDTO.id, fundTransactionDTO.savingsFundId]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch(error){ //if anything in the transaction fails, the trnasaction is nullified and the state returns to pre-transaction
            await client.query('ROLLBACK');
            console.error('Failed to create transaction', error);
            throw error;
        } finally{
            client.release();
        }
    }

    // Reverses the transaction's balance effect and deletes the row in a single transaction.
    async deleteFundTransaction(userId: number,  fundTransaction: FundTransaction): Promise<boolean>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const reverseAmount = fundTransaction.transactionType === 'expenditure' ? fundTransaction.amount : -fundTransaction.amount;
            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [reverseAmount, userId, fundTransaction.savingsFundId]);
            const result = await client.query<FundTransaction>(FundTransactionQueries.DELETE_FUND_TRANSACTION, [userId, fundTransaction.id, fundTransaction.savingsFundId]);
            await client.query('COMMIT');

            return result.rowCount !== null && result.rowCount > 0;
        }catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to delete transaction', error);
            throw error;
        }finally{
            client.release();
        }
    }

    // Moves an amount from one fund to another and records both transactions atomically.
    async transferBalance(userId: number, sendingFund: FundTransactionDTO, receivingFund: FundTransactionDTO): Promise<FundTransaction[]>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [-sendingFund.amount, userId, sendingFund.savingsFundId]);
            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [receivingFund.amount, userId, receivingFund.savingsFundId]);

            const sendingResult = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, sendingFund.savingsFundId, sendingFund.transactionType, sendingFund.amount, sendingFund.description, sendingFund.transactionDate, sendingFund.month]);
            const receivingResult = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, receivingFund.savingsFundId, receivingFund.transactionType, receivingFund.amount, receivingFund.description, receivingFund.transactionDate, receivingFund.month]);

            await client.query('COMMIT');

            return [sendingResult.rows[0], receivingResult.rows[0]];
        }catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to create transfer transaction', error);
            throw error;
        }finally{
            client.release();
        }
    }

    // Sets the fund balance to an exact amount and records an adjustment transaction atomically.
    async adjustBalance(userId: number, adjustBalanceTransaction: FundTransactionDTO): Promise<FundTransaction>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            await client.query<SavingsFund>(SavingsFundQueries.SET_SAVINGS_FUND_BALANCE, [adjustBalanceTransaction.amount, userId, adjustBalanceTransaction.savingsFundId]);

            const result = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, adjustBalanceTransaction.savingsFundId, adjustBalanceTransaction.transactionType, adjustBalanceTransaction.amount, adjustBalanceTransaction.description, adjustBalanceTransaction.transactionDate, adjustBalanceTransaction.month]);

            await client.query('COMMIT');

            return result.rows[0];
        }catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to adjust balance', error);
            throw error;
        }finally{
            client.release();
        }
    }

    // Returns the total contribution amount across all funds for the given month.
    async findContributionSumForMonth(userId: number, month: string): Promise<number>{
        const result = await pool.query(FundTransactionQueries.FIND_CONTRIBUTION_SUM_FOR_MONTH, [userId, month]);
        return result.rows[0].total_contributions;
    }

    // Returns true if the fund has any contribution or expenditure transactions.
    async hasTransactions(userId: number, fundId: number): Promise<boolean>{
        const result = await pool.query(FundTransactionQueries.FIND_CONT_AND_EXP_QTY, [userId, fundId]);
        return result.rows[0].total_records !== null && result.rows[0].total_records > 0;
    }
}
