import { IncomeService } from "../services/income.service";
import { Request, Response, NextFunction } from "express";
import { AuthRequest, IncomeDTO } from "../types";
import { isValidDate, getMonth } from "../utils/date";


// Handles HTTP requests for income management operations.
export class IncomeController{
    constructor(private incomeService: IncomeService){}

    // Validates input and creates a new income record for the authenticated user.
    createIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const { amount, source, description, incomeDate } = req.body;

            if (!amount || !source){
                res.status(400).json({ error: 'Amount and source are required' });
                return;
            }

            if (!incomeDate){
                res.status(400).json({ error: 'Income date is required' });
                return;
            }

            if (!isValidDate(incomeDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (amount < 0){
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            const month = getMonth(incomeDate);

            const incomeDTO: IncomeDTO = {
                userId,
                amount,
                source,
                description,
                incomeDate,
                month
            }

            const result = await this.incomeService.createIncome(incomeDTO);
            res.status(201).json({
                message: 'Successfully created income',
                income: result
            });

        } catch(error: any){
            next(error);
        }

    }

    // Retrieves all income records for the user, optionally filtered by a month query parameter.
    getIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const { month } = req.query;
            let incomeArr;

            if (typeof month === 'string'){
                if (!isValidDate(month as string)){
                    res.status(400).json({ error: 'Invalid date format' });
                    return;
                }
                incomeArr = await this.incomeService.getIncomeByDate(userId, month);
            }
            else{
                incomeArr = await this.incomeService.getAllIncome(userId);
            }
            res.status(200).json({
                message: 'Income retrieved successfully',
                income: incomeArr
            });

        } catch(error: any){
            next(error);
        }
    }

    // Retrieves a single income record by its ID for the authenticated user.
    getIncomeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const incomeId = parseInt(req.params.id as string);

            if (isNaN(incomeId)){
                res.status(400).json({ error: 'Invalid income id' });
                return;
            }

            const income = await this.incomeService.getIncomeById(userId, incomeId);
            res.status(200).json({
                message: 'Successfully retrieved income',
                income: income
             })
        } catch(error: any){
            next(error);
        }
    }

    // Validates input and updates an existing income record by its ID.
    updateIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { amount, source, description, incomeDate } = req.body;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid income id' });
                return;
            }

            if (!amount || !source){
                res.status(400).json({ error: 'Amount and source are required' });
                return;
            }

            if (!incomeDate){
                res.status(400).json({ error: 'Income date is required' });
                return;
            }

            if (!isValidDate(incomeDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (amount < 0){
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            const month = getMonth(incomeDate);

            const incomeDTO: IncomeDTO = {
                id,
                userId,
                amount,
                source,
                description,
                incomeDate,
                month
            }

            const newIncome = await this.incomeService.updateIncome(incomeDTO);
            if (!newIncome){
                res.status(404).json({ error: 'Income not found' });
                return;
            }
            res.status(200).json({
                message: 'Income updated successfully',
                income: newIncome
             });
        } catch(error: any){
            next(error);
        }
    }

    // Deletes an income record by its ID for the authenticated user.
    deleteIncome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const incomeId = parseInt(req.params.id as string);

            if (isNaN(incomeId)){
                res.status(400).json({ error: 'Invalid income id' });
                return;
            }

            await this.incomeService.deleteIncome(incomeId, userId);

            res.status(200).json({ message: 'Income successfully deleted' });
        } catch(error: any){
            next(error);
        }
    }

    // Returns the total sum of all income for a given month.
    getMonthlyIncomeSum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            const incomeSum = await this.incomeService.getMonthlyIncomeSum(userId, month)
            res.status(200).json({
                message: 'Successfully retrieved income total',
                incomeSum
             })
        } catch(error: any){
            next(error);
        }
    }
}
