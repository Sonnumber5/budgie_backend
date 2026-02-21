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

    getFundTransaction = async (req: Request, res: Response): Promise<void> => {
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
}