import { IncomeService } from "../services/income.service";
import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { isValidDate, getMonth } from "../utils/date";
import { AppError } from "../utils/AppError";


export class IncomeController{
    constructor(private incomeService: IncomeService){}

    createIncome = async (req: Request, res: Response): Promise<void>=> {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = authRequest.user.userId;

            const { amount, source, description, income_date } = req.body;

            if (!amount || !source || !income_date){
                res.status(400).json({ error: 'Amount and source are required' });
                return;
            }

            if (!isValidDate(income_date)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (amount < 0){
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            const month = getMonth(income_date);
            const result = await this.incomeService.createIncome(userId, amount, source, description, income_date, month);
            res.status(201).json({
                message: 'Successfully created income',
                income: result
            });

        } catch(error: any){
            console.log('Error creating income', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create income' });
        }

    }

    getIncome = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = authRequest.user.userId;

            const { month } = req.query;
            let result;

            if (typeof month === 'string'){
                if (!isValidDate(month as string)){
                    res.status(400).json({ error: 'Invalid date format' });
                    return;
                }
                result = await this.incomeService.getIncomeByDate(userId, month);
            }
            else{
                result = await this.incomeService.getAllIncome(userId);
            }
            res.status(200).json({ 
                message: 'Income retrieved successfully',
                income: result
            });

        } catch(error: any){
            console.log('Error retrieving income', error),
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve message' });
        }
    }
}