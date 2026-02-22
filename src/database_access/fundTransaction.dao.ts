import { FundTransactionDTO, FundTransaction, SavingsFund } from "../types";
import pool from "../database";
import { FundTransactionQueries } from "../queries/fundTransaction.queries";
import { SavingsFundQueries } from "../queries/savingsFund.queries";
import { AppError } from "../utils/AppError";

export class FundTransactionDAO{
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

    async findFundTransactions(userId: number, fundId: number): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTIONS, [userId, fundId]);
        return result.rows;
    }

    async findFundTransactionById(userId: number, id: number, savingsFundId: number): Promise<FundTransaction>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTION_BY_ID, [userId, id, savingsFundId]);
        return result.rows[0];
    }

    async updateFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO){
        const client = await pool.connect();
        try{
            await client.query('BEGIN');//begin the transaction
            const originalTransaction = (await client.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTION_BY_ID, [userId, fundTransactionDTO.id, fundTransactionDTO.savingsFundId])).rows[0];
            const reverseAmount = originalTransaction.transactionType === 'expenditure' ? originalTransaction.amount : -originalTransaction.amount;
            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [reverseAmount, userId, originalTransaction.savingsFundId]);
            const newAmount = fundTransactionDTO.transactionType === 'contribution' ? fundTransactionDTO.amount : -fundTransactionDTO.amount;
            console.log('REVERSED AMOUNT: ', reverseAmount);
            console.log('NEW AMOUNT: ', newAmount);
            
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

    async transferBalance(userId: number, sendingFund: FundTransactionDTO, receivingFund: FundTransactionDTO): Promise<FundTransaction[]>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [-sendingFund.amount, userId, sendingFund.savingsFundId]);
            await client.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND_BALANCE, [receivingFund.amount, userId, receivingFund.savingsFundId]);

            const sendingResult = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, sendingFund.savingsFundId, sendingFund.transactionType, sendingFund.amount, sendingFund.description, sendingFund.transactionDate]);
            const receivingResult = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, receivingFund.savingsFundId, receivingFund.transactionType, receivingFund.amount, receivingFund.description, receivingFund.transactionDate]);

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

    async adjustBalance(userId: number, adjustBalanceTransaction: FundTransactionDTO): Promise<FundTransaction>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            await client.query<SavingsFund>(SavingsFundQueries.SET_SAVINGS_FUND_BALANCE, [adjustBalanceTransaction.amount, userId, adjustBalanceTransaction.savingsFundId]);

            const result = await client.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, adjustBalanceTransaction.savingsFundId, adjustBalanceTransaction.transactionType, adjustBalanceTransaction.amount, adjustBalanceTransaction.description, adjustBalanceTransaction.transactionDate]);

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

    async findContributionSumForMonth(userId: number, month: string): Promise<number>{
        const result = await pool.query(FundTransactionQueries.FIND_CONTRIBUTION_SUM_FOR_MONTH, [userId, month]);
        return result.rows[0];
    }
}