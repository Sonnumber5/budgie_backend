import { IncomeService } from "../services/income.service";
import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { isValidDate, getMonth } from "../utils/date";


export class IncomeController{
    constructor(private incomeService: IncomeService){}

    createIncome = async (req: Request, res: Response): Promise<void>=> {
        try{
            const userId = (req as AuthRequest).user.userId;
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
}