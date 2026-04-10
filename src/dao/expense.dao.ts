import pool from "../database";
import { Expense, ExpenseDTO } from "../types";
import { ExpenseQueries } from "../queries/expense.queries";

// Data access layer for expense database operations.
export class ExpenseDAO{
    // Inserts a new expense and returns the full record including joined category data.
    async createExpense(expenseDTO: ExpenseDTO): Promise<Expense>{
        const newExpense = await pool.query<Expense>(ExpenseQueries.CREATE_EXPENSE, [expenseDTO.userId, expenseDTO.categoryId, expenseDTO.vendor, expenseDTO.amount, expenseDTO.description, expenseDTO.expenseDate, expenseDTO.month]);
        const newExpenseId = newExpense.rows[0].id;
        const result = await pool.query<Expense>(ExpenseQueries.GET_CREATED_EXPENSE, [expenseDTO.userId, newExpenseId])
        return result.rows[0];
    }

    // Returns all expense rows for the user filtered by month.
    async findExpensesByDate(userId: number, month: string): Promise<Expense[]>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_EXPENSES_BY_DATE, [userId, month]);
        return result.rows;
    }

    // Returns all expense rows for the user with no date filter.
    async findAllExpenses(userId: number): Promise<Expense[]>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_ALL_EXPENSES, [userId]);
        return result.rows;
    }

    // Returns a single expense row by its ID.
    async findExpenseById(userId: number, id: number): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.FIND_EXPENSE_BY_ID, [userId, id]);
        return result.rows[0];
    }

    // Returns the total sum of all expenses for the given month.
    async findMonthlyExpenseSum(userId: number, month: string): Promise<number>{
        const result =  await pool.query(ExpenseQueries.FIND_EXPENSE_SUM_FOR_MONTH, [userId, month]);
        return result.rows[0].expense_sum;
    }

    // Updates an expense row and returns the updated record.
    async updateExpense(userId: number, id: number, expenseDTO: ExpenseDTO): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.UPDATE_EXPENSE, [expenseDTO.categoryId, expenseDTO.vendor, expenseDTO.amount, expenseDTO.description, expenseDTO.expenseDate, expenseDTO.month, id, userId]);
        return result.rows[0];
    }

    // Deletes an expense row and returns true if a row was removed.
    async deleteExpense(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<Expense>(ExpenseQueries.DELETE_EXPENSE, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
