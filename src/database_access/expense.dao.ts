import pool from "../database";
import { Expense, ExpenseDTO } from "../types";
import { ExpenseQueries } from "../queries/expense.queries";

export class ExpenseDAO{
    async createExpense(expenseDTO: ExpenseDTO): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.CREATE_EXPENSE, [expenseDTO.userId, expenseDTO.categoryId, expenseDTO.vendor, expenseDTO.amount, expenseDTO.description, expenseDTO.expenseDate, expenseDTO.month]);
        return result.rows[0];
    }

    async findExpensesByDate(userId: number, month: string): Promise<Expense[]>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_EXPENSES_BY_DATE, [userId, month]);
        return result.rows;
    }

    async findAllExpenses(userId: number): Promise<Expense[]>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_ALL_EXPENSES, [userId]);
        return result.rows;
    }

    async findExpenseById(userId: number, id: number): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_EXPENSE_BY_ID, [userId, id]);
        return result.rows[0];
    }

    async updateExpense(userId: number, id: number, expenseDTO: ExpenseDTO): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.UPDATE_EXPENSE, [expenseDTO.categoryId, expenseDTO.vendor, expenseDTO.amount, expenseDTO.description, expenseDTO.expenseDate, expenseDTO.month, id, userId]);
        return result.rows[0];
    }

    async deleteExpense(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<Expense>(ExpenseQueries.DELETE_EXPENSE, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}