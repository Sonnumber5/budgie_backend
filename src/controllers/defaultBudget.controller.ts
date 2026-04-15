import { DefaultBudgetService } from "../services/defaultBudget.service";
import { NextFunction, Request, Response } from "express";
import { AuthRequest, DefaultBudgetDTO, DefaultCategoryBudgetDTO } from "../types";
import { CategoryService } from "../services/category.service";

export class DefaultBudgetController {
    constructor(private defaultBudgetService: DefaultBudgetService, private categoryService: CategoryService){}

    saveDefaultBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { expectedIncome, defaultCategoryBudgetDTOs } = req.body;

            if (!expectedIncome){
                res.status(400).json({ error: 'Expected income is required' });
                return;
            }

            if (!defaultCategoryBudgetDTOs || !Array.isArray(defaultCategoryBudgetDTOs)){
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

            const newDefaultCategoryBudgetDTOs: DefaultCategoryBudgetDTO[] = []

            for (const defaultCategoryBudget of defaultCategoryBudgetDTOs){
                if (!defaultCategoryBudget.categoryName || defaultCategoryBudget.budgetedAmount === undefined){
                    res.status(400).json({ error: 'Each category budget must have a name and budgeted amount' });
                    return;
                }

                if (defaultCategoryBudget.budgetedAmount <= 0){
                    res.status(400).json({ error: 'Budgeted amounts must be positive' });
                    return;
                }

                const category = await this.categoryService.getOrCreateCategory(userId, defaultCategoryBudget.categoryName);

                const newDefaultCategoryBudgetDTO: DefaultCategoryBudgetDTO = {
                    userId,
                    categoryId: category.id,
                    budgetedAmount: defaultCategoryBudget.budgetedAmount
                };
                newDefaultCategoryBudgetDTOs.push(newDefaultCategoryBudgetDTO);
            }

            const defaultBudgetToAdd: DefaultBudgetDTO = {
                userId,
                expectedIncome,
                defaultCategoryBudgetDTOs: newDefaultCategoryBudgetDTOs
            }
            const newDefaultBudget = await this.defaultBudgetService.saveDefaultBudget(defaultBudgetToAdd);

            res.status(201).json({
                message: 'Default budget saved successfully',
                defaulttBudget: newDefaultBudget
            });

        } catch(error: any){
            next(error);
        }
    }

    getDefaultBudgetByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const result = await this.defaultBudgetService.getDefaultBudgetByUserId(userId);

            res.status(200).json({
                message: 'Successfully retrieved default budget with default category budgets',
                defaultBudget: result
            });
        } catch(error: any){
            next(error);
        }
    }
}