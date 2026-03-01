import { Request, Response } from "express";
import { BudgetService } from "../services/budget.service";
import { AuthRequest, CategoryBudgetDTO, MonthlyBudgetDTO } from "../types";
import { isValidDate } from "../utils/date";
import { CategoryService } from "../services/category.service";

export class MonthlyBudgetController{
    constructor(private budgetService: BudgetService, private categoryService: CategoryService){}

    createMonthlyBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { month, expectedIncome, categoryBudgetDTOs } = req.body;

            if (!expectedIncome || !month){
                res.status(400).json({ error: 'Expected income and month are required' });
                return;
            }

            if (!categoryBudgetDTOs || !Array.isArray(categoryBudgetDTOs)){
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

            const newCategoryBudgetDTOs: CategoryBudgetDTO[] = []

            for (const categoryBudget of categoryBudgetDTOs){
                if (!categoryBudget.categoryName || categoryBudget.budgetedAmount === undefined){
                    res.status(400).json({ error: 'Each category budget must have categoryName and budgetedAmount' });
                    return;
                }
                
                if (categoryBudget.budgetedAmount <= 0){
                    res.status(400).json({ error: 'Budgeted amounts must be positive' });
                    return;
                }
                
                const category = await this.categoryService.getOrCreateCategory(userId, categoryBudget.categoryName);

                const newCategoryBudgetDTO: CategoryBudgetDTO = {
                    userId,
                    categoryId: category.id,
                    budgetedAmount: categoryBudget.budgetedAmount
                };
                newCategoryBudgetDTOs.push(newCategoryBudgetDTO);
            }

            const monthlyBudgetToAdd: MonthlyBudgetDTO = {
                userId,
                month,
                expectedIncome,
                categoryBudgetDTOs: newCategoryBudgetDTOs
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
            if (error.statusCode !== 404) {
                console.log('Error retrieving budget', error);
            }
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve budget' });
        }
    }

    updateMonthlyBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { expectedIncome, categoryBudgetDTOs } = req.body;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid monthly budget id' });
                return;
            }

            if (!expectedIncome){
                res.status(400).json({ error: 'Expected income is required' });
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

            const newCategoryBudgetDTOs: CategoryBudgetDTO[] = []

            if (categoryBudgetDTOs && Array.isArray(categoryBudgetDTOs)) {
                for (const categoryBudget of categoryBudgetDTOs){
                    if (!categoryBudget.categoryName){
                        res.status(400).json({ error: 'Category name is required for new category budgets' });
                        return;
                    }
                    
                    if (categoryBudget.budgetedAmount === undefined || categoryBudget.budgetedAmount <= 0){
                        res.status(400).json({ error: 'Budgeted amount must be a positive number' });
                        return;
                    }

                    const category = await this.categoryService.getOrCreateCategory(userId, categoryBudget.categoryName);

                    const newCategoryBudgetDTO: CategoryBudgetDTO = {
                        userId,
                        monthlyBudgetId: id,
                        categoryId: category.id,
                        budgetedAmount: categoryBudget.budgetedAmount
                    };
                    newCategoryBudgetDTOs.push(newCategoryBudgetDTO);
                }
            }

            const monthlyBudgetToUpdate: MonthlyBudgetDTO = {
                id,
                userId,
                expectedIncome,
                categoryBudgetDTOs: newCategoryBudgetDTOs
            }
            const updatedMonthlyBudget = await this.budgetService.updateMonthlyBudget(monthlyBudgetToUpdate);

            res.status(200).json({
                message: 'Monthly budget updated successfully',
                monthlyBudget: updatedMonthlyBudget
            });

        } catch(error: any){
            console.log('Error updating monthly budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update monthly budget' });
        }
    }

    deleteMonthlyBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);
            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid monthly budget id' });
                return;
            }
            await this.budgetService.deleteMonthlyBudget(userId, id);
            res.status(200).json({ message: 'Monthly budget successfully deleted' });
        }catch(error: any){
            console.log('Error deleting monthly budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to delete monthly budget' });
        }
    }

    getCategoryBudgetById = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid category budget id' });
                return;
            }

            const result = await this.budgetService.getCategoryBudgetById(userId, id);
            res.status(200).json({ 
                message: 'Successfully retrieved category budget', 
                categoryBudget: result
            });
        }catch(error: any){
            console.log('Error retrieving category budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve category budget' });
        }
    }

    deleteCategoryBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid category budget id' });
                return;
            }
            await this.budgetService.deleteCategoryBudget(userId, id);
            res.status(200).json({ message: 'Successfully deleted category budget' });
        } catch(error: any){
            console.log('Error deleting category budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to delete category budget' });
        }
    }

    updateCategoryBudget = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);
            const { budgetedAmount } = req.body;

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid category budget id' });
                return;
            }

            if (isNaN(budgetedAmount) || budgetedAmount <= 0){
                res.status(400).json({ error: 'Budgeted amount must be a positive number' });
                return;
            }

            const updatedCategoryBudget = await this.budgetService.updateCategoryBudget(budgetedAmount, id, userId);
            res.status(200).json({ 
                message: 'Successfully updated category budget',
                categoryBudget: updatedCategoryBudget
            });
        } catch(error: any){
            console.log('Error updating category budget', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to update category budget' });
        }
    }
}