import { FundTransactionService } from "../services/fundTransaction.service";
import { Request, Response } from "express";
import { AuthRequest, FundTransactionDTO, TransactionType } from "../types";
import { isValidDate } from "../utils/date";

export class FundTransactionController{
    constructor(private fundTransactionService: FundTransactionService){}

    createFundTransaction = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);
            const { transactionType, amount, description, transactionDate } = req.body;

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0){
                res.status(400).json({ error: 'amount is required and must be a postive number' });
                return;
            }
            
            if (!transactionDate){
                res.status(400).json({ error: 'Transaction date is required' });
                return;
            }

            if (!isValidDate(transactionDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            const validTypeForRegTransaction: TransactionType[] = ["contribution", "expenditure"];
            if (!validTypeForRegTransaction.includes(transactionType)){
                res.status(400).json({ error: 'Transaction type must be either contribution or expenditure' });
                return;
            }
            const fundTransactionDTO: FundTransactionDTO = {
                savingsFundId: fundId,
                transactionType,
                amount,
                description,
                transactionDate
            }
            const result = await this.fundTransactionService.createFundTransaction(userId, fundTransactionDTO);
            res.status(201).json({ 
                message: (transactionType === "contribution") ? 'successfully added to fund' : 'successfully expended from fund',
                fundTransaction: result
            });
        }catch(error: any){
            console.log('Error creating transaction', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create transaction' });
        }
    }

    getFundTransactions = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const result = await this.fundTransactionService.getFundTransactions(userId, fundId);
            res.status(200).json({ 
                message: 'Successfully retrieved transactions',
                fundTransactions: result
            });
        }catch(error: any){
            console.log('Error retrieving transactions', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve transactions' });
        }
    }

    getFundTransactionById = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const transactionId = parseInt(req.params.transactionId as string);
            const fundId = parseInt(req.params.fundId as string);

            if (isNaN(transactionId) || transactionId <= 0){
                res.status(400).json({ error: 'Invalid transaction id format' });
                return;
            }

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const result = await this.fundTransactionService.getFundTransactionById(userId, transactionId, fundId);
            res.status(200).json({ 
                message: 'Successfully retrieved transaction',
                fundTransaction: result
            });
        }catch(error: any){
            console.log('Error retrieving transaction', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve transaction' });
        }
    }

    updateFundTransaction = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);
            const transactionId = parseInt(req.params.transactionId as string);
            const { transactionType, amount, description, transactionDate } = req.body;

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            if (isNaN(transactionId) || transactionId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0){
                res.status(400).json({ error: 'amount is required and must be a postive number' });
                return;
            }
            
            if (!transactionDate){
                res.status(400).json({ error: 'Transaction date is required' });
                return;
            }

            if (!isValidDate(transactionDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            const validTypeForRegTransaction: TransactionType[] = ["contribution", "expenditure"];
            if (!validTypeForRegTransaction.includes(transactionType)){
                res.status(400).json({ error: 'Transaction type must be either contribution or expenditure' });
                return;
            }
            const fundTransactionDTO: FundTransactionDTO = {
                id: transactionId,
                savingsFundId: fundId,
                transactionType,
                amount,
                description,
                transactionDate
            }
            const result = await this.fundTransactionService.updateFundTransaction(userId, fundTransactionDTO);
            res.status(200).json({ 
                message: 'successfully updated fund',
                fundTransaction: result
            });
        }catch(error: any){
            console.log('Error updating transaction', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update transaction' });
        }
    }

    deleteFundTransaction = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const transactionId = parseInt(req.params.transactionId as string);
            const fundId = parseInt(req.params.fundId as string);

            if (isNaN(transactionId) || transactionId <= 0){
                res.status(400).json({ error: 'Invalid transaction id format' });
                return;
            }

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            await this.fundTransactionService.deleteFundTransaction(userId, transactionId, fundId);
            res.status(200).json({ 
                message: 'Successfully deleted transaction',
            });
        }catch(error: any){
            console.log('Error deleting transaction', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to delete transaction' });
        }
    }

    transferBalance = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const savingsFundId = parseInt(req.params.fundId as string);
            const transactionDate = new Date().toISOString().split('T')[0];
            const { amount, relatedFundId } = req.body;

            if (isNaN(savingsFundId) || savingsFundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const parsedRelatedFundId = parseInt(relatedFundId);
            if (isNaN(parsedRelatedFundId) || parsedRelatedFundId <= 0){
                res.status(400).json({ error: 'Invalid receiving fund id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0){
                res.status(400).json({ error: 'amount is required and must be a postive number' });
                return;
            }

            const sendingFund: FundTransactionDTO = {
                savingsFundId,
                transactionType: "transfer_out",
                amount,
                description: "Transfer out from another fund",
                transactionDate,
                relatedFundId
            }
            const receivingFund: FundTransactionDTO = {
                savingsFundId: relatedFundId,
                transactionType: "transfer_in",
                amount,
                description: "Transfer in from another fund",
                transactionDate,
                relatedFundId: savingsFundId
            }
            const transactions = await this.fundTransactionService.transferBalance(userId, sendingFund, receivingFund);
            res.status(200).json({ 
                message: 'Successfully transfered balance',
                transactions
            });
        }catch(error: any){
            console.log('Error transfering balance', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to transfer balance' });
        }
    }
}