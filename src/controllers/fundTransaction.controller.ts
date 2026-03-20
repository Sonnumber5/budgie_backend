import { FundTransactionService } from "../services/fundTransaction.service";
import { Request, Response, NextFunction } from "express";
import { AuthRequest, FundTransactionDTO, TransactionType } from "../types";
import { isValidDate } from "../utils/date";

export class FundTransactionController{
    constructor(private fundTransactionService: FundTransactionService){}

    createFundTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);
            const { transactionType, amount, description, transactionDate, month } = req.body;

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0){
                res.status(400).json({ error: 'amount is required and must be a positive number' });
                return;
            }

            if (!transactionDate){
                res.status(400).json({ error: 'Transaction date is required' });
                return;
            }

            if (!month){
                res.status(400).json({ error: 'Month is required' });
                return;
            }

            if (!isValidDate(transactionDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
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
                transactionDate,
                month
            }
            const result = await this.fundTransactionService.createFundTransaction(userId, fundTransactionDTO);
            res.status(201).json({
                message: (transactionType === "contribution") ? 'successfully added to fund' : 'successfully expended from fund',
                fundTransaction: result
            });
        } catch(error: any){
            next(error);
        }
    }

    getFundTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);
            let transactionArr;

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const { month } = req.query;
            if (typeof(month) === "string"){
                if (!isValidDate(month)){
                    res.status(400).json({ error: 'Invalid month format' });
                    return
                }
                transactionArr = await this.fundTransactionService.getFundTransactionsByMonth(userId, fundId, month);
            } else {
                transactionArr = await this.fundTransactionService.getFundTransactions(userId, fundId);
            }

            res.status(200).json({
                message: 'Successfully retrieved transactions',
                fundTransactions: transactionArr
            });
        } catch(error: any){
            next(error);
        }
    }

    getAllTransactionsForActiveFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const allTransactions = await this.fundTransactionService.getAllTransactionsForActiveFunds(userId);

            res.status(200).json({
                message: 'Successfully retrieved transactions',
                activeFundTransactions: allTransactions
            });
        } catch(error: any){
            next(error);
        }
    }

    getFundTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch(error: any){
            next(error);
        }
    }

    updateFundTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const fundId = parseInt(req.params.fundId as string);
            const transactionId = parseInt(req.params.transactionId as string);
            const { transactionType, amount, description, transactionDate, month } = req.body;

            if (isNaN(fundId) || fundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            if (isNaN(transactionId) || transactionId <= 0){
                res.status(400).json({ error: 'Invalid transaction id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0){
                res.status(400).json({ error: 'amount is required and must be a positive number' });
                return;
            }

            if (!transactionDate){
                res.status(400).json({ error: 'Transaction date is required' });
                return;
            }

            if (!month){
                res.status(400).json({ error: 'Month is required' });
                return;
            }

            if (!isValidDate(transactionDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
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
                transactionDate,
                month
            }
            const result = await this.fundTransactionService.updateFundTransaction(userId, fundTransactionDTO);
            res.status(200).json({
                message: 'successfully updated fund',
                fundTransaction: result
            });
        } catch(error: any){
            next(error);
        }
    }

    deleteFundTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        } catch(error: any){
            next(error);
        }
    }

    transferBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const savingsFundId = parseInt(req.params.fundId as string);
            const transactionDate = new Date().toISOString().split('T')[0];
            const { amount, relatedFundId, month } = req.body;

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
                res.status(400).json({ error: 'amount is required and must be a positive number' });
                return;
            }

            if (!month){
                res.status(400).json({ error: 'Month is required' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
                return;
            }

            const sendingFund: FundTransactionDTO = {
                savingsFundId,
                transactionType: "transfer_out",
                amount,
                description: "Transfer out from another fund",
                transactionDate,
                month,
                relatedFundId,
            }
            const receivingFund: FundTransactionDTO = {
                savingsFundId: relatedFundId,
                transactionType: "transfer_in",
                amount,
                description: "Transfer in from another fund",
                transactionDate,
                month,
                relatedFundId: savingsFundId
            }
            const fundTransactions = await this.fundTransactionService.transferBalance(userId, sendingFund, receivingFund);
            res.status(200).json({
                message: 'Successfully transferred balance',
                fundTransactions
            });
        } catch(error: any){
            next(error);
        }
    }

    adjustBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const savingsFundId = parseInt(req.params.fundId as string);
            const transactionDate = new Date().toISOString().split('T')[0];
            const { amount, month } = req.body;

            if (isNaN(savingsFundId) || savingsFundId <= 0){
                res.status(400).json({ error: 'Invalid fund id format' });
                return;
            }

            const parsedAmount = Number(amount);
            if (isNaN(parsedAmount) || parsedAmount < 0){
                res.status(400).json({ error: 'amount is required and must be a positive number' });
                return;
            }

            if (!month){
                res.status(400).json({ error: 'Month is required' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
                return;
            }

            const adjustBalanceTransaction: FundTransactionDTO = {
                savingsFundId,
                transactionType: "adjustment",
                amount,
                description: "Balance adjustment",
                transactionDate,
                month
            }

            const fundTransaction = await this.fundTransactionService.adjustBalance(userId, adjustBalanceTransaction);
            res.status(200).json({
                message: 'Successfully adjusted balance',
                fundTransaction
            });
        } catch(error: any){
            next(error);
        }
    }

    getContributionSumForMonth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const month = req.query.month as string;

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }
            const totalContributions = await this.fundTransactionService.getContributionSumForMonth(userId, month);
            res.status(200).json({
                message: 'Successfully retrieved the sum of all contributions for the month',
                totalContributions
            })

        } catch(error: any){
            next(error);
        }
    }

}
