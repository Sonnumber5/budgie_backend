import { FundTransactionDAO } from "../dao/fundTransaction.dao";
import { SavingsFundDAO } from "../dao/savingsFund.dao";
import { FundTransactionQueries } from "../queries/fundTransaction.queries";
import { FundTransaction, FundTransactionDTO, TransactionType } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for savings fund transaction operations.
export class FundTransactionService{
    constructor(private fundTransactionDAO: FundTransactionDAO, private savingsFundDAO: SavingsFundDAO){}

    // Verifies the fund exists and has sufficient balance, then creates the transaction.
    async createFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO): Promise<FundTransaction>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundTransactionDTO.savingsFundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        if (fundTransactionDTO.transactionType === "expenditure"){
            const remainingBalance = existingFund.balance - fundTransactionDTO.amount;
            if (remainingBalance < 0){
                throw new AppError('Insufficient funds', 400);
            }
        }
        return await this.fundTransactionDAO.createFundTransaction(userId, fundTransactionDTO);
    }

    // Returns all transactions for a fund, throwing 404 if the fund doesn't exist.
    async getFundTransactions(userId: number, fundId: number): Promise<FundTransaction[]>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        return await this.fundTransactionDAO.findFundTransactions(userId, fundId);
    }

    // Returns all transactions across every active savings fund for the user.
    async getAllTransactions(userId: number): Promise<FundTransaction[]>{
        return await this.fundTransactionDAO.findAllTransactions(userId);
    }

    // Returns all  transactions across every active savings fund for the user for a given month.
    async getMonthlyTransactions(userId: number, month: string): Promise<FundTransaction[]>{
        return await this.fundTransactionDAO.findMonthlyTransactions(userId, month);
    }

    // Returns transactions for a fund filtered by month, throwing 404 if the fund doesn't exist.
    async getFundTransactionsByMonth(userId: number, fundId: number, month: string): Promise<FundTransaction[]>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        return await this.fundTransactionDAO.findFundTransactionsForMonth(userId, fundId, month);
    }

    // Returns a single transaction by ID within a fund, throwing 404 if either doesn't exist.
    async getFundTransactionById(userId: number, transactionId: number, fundId: number): Promise<FundTransaction>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        const result = await this.fundTransactionDAO.findFundTransactionById(userId, transactionId, fundId);
        if (!result){
            throw new AppError('Transaction not found', 404);
        }
        return result;
    }

    // Updates a transaction, checking for sufficient balance if changing to an expenditure.
    async updateFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO): Promise<FundTransaction>{
        if (!fundTransactionDTO.id){
            throw new AppError('Transaction id required', 400);
        }
        const existingTransaction = await this.fundTransactionDAO.findFundTransactionById(userId, fundTransactionDTO.id, fundTransactionDTO.savingsFundId);
        if (!existingTransaction){
            throw new AppError('Transaction not found', 404);
        }
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundTransactionDTO.savingsFundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        if (fundTransactionDTO.transactionType === "expenditure"){
            const balanceAfterReversal = existingTransaction.transactionType === 'contribution'
                ? existingFund.balance - existingTransaction.amount
                : existingFund.balance + existingTransaction.amount;

            if (balanceAfterReversal - fundTransactionDTO.amount < 0){
                throw new AppError('Insufficient funds', 400);
            }
        }
        return await this.fundTransactionDAO.updateFundTransaction(userId, fundTransactionDTO);
    }

    // Deletes a transaction and reverses its effect on the fund balance.
    async deleteFundTransaction(userId: number, transactionId: number, fundId: number): Promise<void>{
        const existingTransaction = await this.fundTransactionDAO.findFundTransactionById(userId, transactionId, fundId);
        if (!existingTransaction){
            throw new AppError('Transaction not found', 404);
        }

        const result = await this.fundTransactionDAO.deleteFundTransaction(userId, existingTransaction);
        if (!result){
            throw new AppError('Failed to delete transaction', 500);
        }
    }

    // Moves an amount from one fund to another, validating both exist and the sender has sufficient balance.
    async transferBalance(userId: number, sendingFund: FundTransactionDTO, receivingFund: FundTransactionDTO): Promise<FundTransaction[]>{
        const sendingFundExists = await this.savingsFundDAO.findSavingsFundById(userId, sendingFund.savingsFundId);
        const receivingFundExists = await this.savingsFundDAO.findSavingsFundById(userId, receivingFund.savingsFundId);
        if (!sendingFundExists){
            throw new AppError('Sending fund not found', 404);
        }
        if (!receivingFundExists){
            throw new AppError('Receiving fund not found', 404);
        }
        if (sendingFundExists.balance - sendingFund.amount < 0){
            throw new AppError('Insufficient funds', 400);
        }
       return await this.fundTransactionDAO.transferBalance(userId, sendingFund, receivingFund);
    }

    // Sets a fund's balance to a specific amount and records an adjustment transaction.
    async adjustBalance(userId: number, adjustBalanceTransaction: FundTransactionDTO): Promise<FundTransaction>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, adjustBalanceTransaction.savingsFundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        return await this.fundTransactionDAO.adjustBalance(userId, adjustBalanceTransaction);
    }

    // Returns the total contribution amount across all funds for the given month.
    async getContributionSumForMonth(userId: number, month: string): Promise<number>{
        return await this.fundTransactionDAO.findContributionSumForMonth(userId, month);
    }
}
