import { FundTransactionDAO } from "../database_access/fundTransaction.dao";
import { SavingsFundDAO } from "../database_access/savingsFund.dao";
import { FundTransactionQueries } from "../queries/fundTransaction.queries";
import { FundTransaction, FundTransactionDTO, TransactionType } from "../types";
import { AppError } from "../utils/AppError";

export class FundTransactionService{
    constructor(private fundTransactionDAO: FundTransactionDAO, private savingsFundDAO: SavingsFundDAO){}

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

    async getFundTransactions(userId: number, fundId: number): Promise<FundTransaction[]>{
        const existingFund = await this.savingsFundDAO.findSavingsFundById(userId, fundId);
        if (!existingFund){
            throw new AppError('Savings fund not found', 404);
        }
        return await this.fundTransactionDAO.findFundTransactions(userId, fundId);
    }

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

    async updateFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO): Promise<FundTransaction>{
        if (!fundTransactionDTO.id){
            throw new AppError('Transaction id required', 404);
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

    async transferBalance(userId: number, sendingFund: FundTransactionDTO, receivingFund: FundTransactionDTO): Promise<FundTransaction[]>{ 
        if (!sendingFund.savingsFundId){
            throw new AppError('Sending fund id is required', 400);
        }
        if (!receivingFund.savingsFundId){
            throw new AppError('Receiving fund id is required', 400);
        }
        const sendingFundExists = await this.savingsFundDAO.findSavingsFundById(userId, sendingFund.savingsFundId);
        const receivingFundExists = await this.savingsFundDAO.findSavingsFundById(userId, receivingFund.savingsFundId);
        if (!sendingFundExists || !receivingFundExists){
            throw new AppError('Savings fund not found', 404);
        }
        if (sendingFundExists.balance - sendingFund.amount < 0){
            throw new AppError('Insufficient funds', 400);
        }
       return await this.fundTransactionDAO.transferBalance(userId, sendingFund, receivingFund);
    }
}