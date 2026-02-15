import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.service";
import { AuthRequest, ExpenseDTO } from "../types";
import { CategoryService } from "../services/category.service";
import { getMonth, isValidDate } from "../utils/date";

export class ExpenseController{
    constructor(private expenseService: ExpenseService, private categoryService: CategoryService){}

    createExpense = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const { existingCategoryId, vendor, amount, description, expenseDate } = req.body;
            
            let category;

            if (!existingCategoryId){
                category = await this.categoryService.getCategoryByName(userId, 'Uncategorized');
            } else{
                category = await this.categoryService.getCategoryById(userId, existingCategoryId);
            }

            if (!category) {
                res.status(500).json({ error: 'Default category not found' });
                return;
            }
            
            let categoryId = category.id;

            if (!vendor || !amount || !expenseDate) {
                res.status(400).json({ error: 'Vendor, amount, and expense date are required' });
                return;
            }

            if (!isValidDate(expenseDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            const month = getMonth(expenseDate);

            const newExpense: ExpenseDTO = {
                userId,
                categoryId,
                vendor,
                amount, 
                description,
                expenseDate,
                month
            }

            const result = await this.expenseService.createExpense(newExpense);
            res.status(201).json({ 
                message: 'Expense created successfully',
                expense: result
             })

        } catch(error: any){
            console.log('Error creating expense', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create expense' });
        }
    }

    getExpenses = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            let expensesArr;

            const { month } = req.query;
            if (typeof(month) === "string"){
                if (!isValidDate(month as string)){
                    res.status(400).json({ error: 'invalid date format' });
                    return;
                }
                expensesArr = await this.expenseService.getExpensesByDate(userId, month);
            } else{
                expensesArr = await this.expenseService.getAllExpenses(userId);
            }
            res.status(200).json({
                message: 'Successfully retrieved expenses',
                expenses: expensesArr
            });
        } catch(error: any){
            console.log('Error retieving expenses', error);
            res.status(error.statusCode || 500).json({ error: error.message || "Failed to retrieve expenses" });
        }
    }

    getExpenseById = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(400).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const categoryId = parseInt(req.params.id as string);

            if (isNaN(categoryId)){
                res.status(400).json({ error: 'Invalid expense id' });
            }

            const expense = await this.expenseService.getExpenseById(userId, categoryId);
            res.status(200).json({
                message: 'Successfully retrieved expense',
                expense: expense
            });

        } catch(error: any){
            console.log('Error retrieving expense', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve expense' });
        }
    }
}