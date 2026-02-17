import { Request, Response } from "express";
import { MonthlyBudgetService } from "../services/monthlyBudget.service";
import { AuthRequest, CategoryBudgetDTO, MonthlyBudgetDTO } from "../types";
import { isValidDate } from "../utils/date";

export class MonthlyBudgetController{
    constructor(private monthlyBudgetService: MonthlyBudgetService){}

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

            if (!categoryBudgets){
                res.status(400).json({ error: 'Array of category budgets are required' });
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
            const newMonthlyBudget = await this.monthlyBudgetService.createMonthlyBudget(monthlyBudgetToAdd);

            res.status(201).json({
                message: 'Monthly budget created successfully',
                monthlyBudget: newMonthlyBudget
            });

        } catch(error: any){
            console.log('Error creating monthly budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create monthly budget' });
        }
    }
}