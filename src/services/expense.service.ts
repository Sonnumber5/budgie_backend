import { CategoryDAO } from "../dao/category.dao";
import { ExpenseDAO } from "../dao/expense.dao";
import { Expense, ExpenseDTO } from "../types";
import { AppError } from "../utils/AppError";


// Business logic layer for expense management operations.
export class ExpenseService{
    constructor(private expenseDAO: ExpenseDAO, private categoryDAO: CategoryDAO){}

    // Verifies the category exists and creates a new expense record.
    async createExpense(expenseDTO: ExpenseDTO): Promise<Expense>{
        const existingCategory = await this.categoryDAO.findCategoryById(expenseDTO.userId, expenseDTO.categoryId);

        if (!existingCategory){
            throw new AppError('Category not found', 404);
        }
        return await this.expenseDAO.createExpense(expenseDTO);
    }

    // Returns all expenses for the user filtered by month.
    async getExpensesByDate(userId: number, month: string): Promise<Expense[]>{
        return await this.expenseDAO.findExpensesByDate(userId, month);
    }

    // Returns all expenses for the user with no date filter.
    async getAllExpenses(userId: number): Promise<Expense[]>{
        return await this.expenseDAO.findAllExpenses(userId);
    }

    // Returns a single expense by ID, throwing 404 if not found.
    async getExpenseById(userId: number, id: number): Promise<Expense>{
        const result = await this.expenseDAO.findExpenseById(userId, id);
        if (!result){
            throw new AppError('Expense not found', 404);
        }
        return result;
    }

    // Verifies the category and expense exist, then updates the expense record.
    async updateExpense(userId: number, id: number, expenseDTO: ExpenseDTO): Promise<Expense>{
        const existingCategory = await this.categoryDAO.findCategoryById(userId, expenseDTO.categoryId);
        if (!existingCategory){
            throw new AppError('Category not found', 404);
        }

        const existingExpense = await this.expenseDAO.findExpenseById(userId, id);
        if (!existingExpense){
            throw new AppError('Expense not found', 404);
        }
        await this.expenseDAO.updateExpense(userId, id, expenseDTO);
        return await this.expenseDAO.findExpenseById(userId, id);
    }

    // Deletes an expense by ID, throwing 404 if not found.
    async deleteExpense(userId: number, id: number): Promise<void>{
        const result = await this.expenseDAO.deleteExpense(userId, id);
        if (!result){
            throw new AppError('Expense not found', 404);
        }
    }

    // Returns the total sum of all expenses for the given month.
    async getMonthlyExpenseSum(userId: number, month: string): Promise<number>{
        return await this.expenseDAO.findMonthlyExpenseSum(userId, month);
    }
}
