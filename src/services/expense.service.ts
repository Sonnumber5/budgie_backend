import { CategoryDAO } from "../database_access/category.dao";
import { ExpenseDAO } from "../database_access/expense.dao";
import { Expense, ExpenseDTO } from "../types";
import { AppError } from "../utils/AppError";


export class ExpenseService{
    constructor(private expenseDAO: ExpenseDAO, private categoryDAO: CategoryDAO){}

    async createExpense(expenseDTO: ExpenseDTO): Promise<Expense>{
        const existingCategory = await this.categoryDAO.findCategoryById(expenseDTO.userId, expenseDTO.categoryId);
        
        if (!existingCategory){
            throw new AppError('Category not found', 404);
        }
        return await this.expenseDAO.createExpense(expenseDTO);
    }

    async getExpensesByDate(userId: number, month: string): Promise<Expense[]>{
        return await this.expenseDAO.findExpensesByDate(userId, month);
    }

    async getAllExpenses(userId: number): Promise<Expense[]>{
        return await this.expenseDAO.findAllExpenses(userId);
    }
}