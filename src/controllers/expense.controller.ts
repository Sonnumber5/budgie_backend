import { Request, Response, NextFunction } from "express";
import { ExpenseService } from "../services/expense.service";
import { AuthRequest, ExpenseDTO } from "../types";
import { CategoryService } from "../services/category.service";
import { getMonth, isValidDate } from "../utils/date";

// Handles HTTP requests for expense management operations.
export class ExpenseController{
    constructor(private expenseService: ExpenseService, private categoryService: CategoryService){}

    // Validates input and creates a new expense for the authenticated user.
    createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const { existingCategoryId, vendor, amount, description, expenseDate, month } = req.body;

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

            if (amount < 0){
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            if (!isValidDate(expenseDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
                return;
            }

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
            next(error);
        }
    }

    // Retrieves all expenses for the user, optionally filtered by a month query parameter.
    getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                    res.status(400).json({ error: 'Invalid date format' });
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
            next(error);
        }
    }

    // Retrieves a single expense by its ID for the authenticated user.
    getExpenseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const expenseId = parseInt(req.params.id as string);

            if (isNaN(expenseId)){
                res.status(400).json({ error: 'Invalid expense id' });
                return;
            }

            const expense = await this.expenseService.getExpenseById(userId, expenseId);
            res.status(200).json({
                message: 'Successfully retrieved expense',
                expense: expense
            });

        } catch(error: any){
            next(error);
        }
    }

    // Validates input and updates an existing expense by its ID.
    updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { existingCategoryId, vendor, amount, description, expenseDate, month } = req.body;

            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid expense id' });
                return;
            }

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

            if (amount < 0){
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            if (!isValidDate(expenseDate)){
                res.status(400).json({ error: 'Invalid date format' });
                return;
            }

            if (!isValidDate(month)){
                res.status(400).json({ error: 'Invalid month format' });
                return;
            }

            const updateExpense: ExpenseDTO = {
                userId,
                categoryId,
                vendor,
                amount,
                description,
                expenseDate,
                month
            }

            const result = await this.expenseService.updateExpense(userId, id, updateExpense);
            res.status(200).json({
                message: 'Expense updated successfully',
                expense: result
             })

        } catch(error: any){
            next(error);
        }
    }

    // Deletes an expense by its ID for the authenticated user.
    deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid expense id' });
                return;
            }

            await this.expenseService.deleteExpense(userId, id);
            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch(error: any){
            next(error);
        }
    }

    // Returns the total sum of all expenses for a given month.
    getMonthlyExpenseSum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            const expenseSum = await this.expenseService.getMonthlyExpenseSum(userId, month)
            res.status(200).json({
                message: 'Successfully retrieved expense total',
                expenseSum
             })
        } catch(error: any){
            next(error);
        }
    }
}
