import { Request, Response } from "express";
import { BudgetService } from "../services/budget.service";
import { AuthRequest, CategoryBudgetDTO, MonthlyBudgetDTO } from "../types";
import { getMonth, isValidDate } from "../utils/date";

export class MonthlyBudgetController{
    constructor(private budgetService: BudgetService){}

    createMonthlyBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { month, expectedIncome, categoryBudgets } = req.body;

            if (!expectedIncome || !month){
                res.status(400).json({ error: 'Expected income and month are required' });
                return;
            }

            if (!categoryBudgets || !Array.isArray(categoryBudgets)){
                res.status(400).json({ error: 'Category budgets must be an array' });
                return;
            }

            if (isNaN(expectedIncome)){
                res.status(400).json({ error: 'Expected income must be a number' });
                return;
            }

            if (expectedIncome <= 0){
                res.status(400).json({ error: 'Expected income must be a positive number' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            const categoryBudgetDTOs: CategoryBudgetDTO[] = []

            if (categoryBudgets.length > 0){
                for (const categoryBudget of categoryBudgets){
                    const newCategoryBudgetDTO: CategoryBudgetDTO = {
                        userId,
                        categoryId: categoryBudget.categoryId,
                        budgetedAmount: categoryBudget.budgetedAmount
                    };
                    categoryBudgetDTOs.push(newCategoryBudgetDTO);
                }
            }

            const monthlyBudgetToAdd: MonthlyBudgetDTO = {
                userId,
                month,
                expectedIncome,
                categoryBudgetDTOs
            }
            const newMonthlyBudget = await this.budgetService.createMonthlyBudget(monthlyBudgetToAdd);

            res.status(201).json({
                message: 'Monthly budget created successfully',
                monthlyBudget: newMonthlyBudget
            });

        } catch(error: any){
            console.log('Error creating monthly budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create monthly budget' });
        }
    }

    getBudgetByMonthlyBudgetId = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const monthlyBudgetId = parseInt(req.params.id as string);

            if (isNaN(monthlyBudgetId)){
                res.status(400).json({ error: 'Invalid monthly budget id' });
                return;
            }

            const result = await this.budgetService.getMonthlyBudgetWithCategoriesById(userId, monthlyBudgetId);

            res.status(200).json({
                message: 'Successfully retrieved monthly budget with category budgets',
                budget: result
            });
        } catch(error: any){
            console.log('Error retrieving budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve budget' });
        }
    }

    getBudgetByMonth = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { month }  = req.query;

            if (typeof(month) === 'string'){
                if (!isValidDate(month)){
                    res.status(400).json({ error: 'Invalid date format' });
                    return;
                }
            } else{
                res.status(400).json({ error: 'Month parameter is required' });
                return;
            }
            
            const result = await this.budgetService.getMonthlyBudgetWithCategoriesByMonth(userId, month);

            res.status(200).json({
                message: 'Successfully retrieved monthly budget with category budgets',
                budget: result
            });
        } catch(error: any){
            console.log('Error retrieving budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve budget' });
        }
    }
}