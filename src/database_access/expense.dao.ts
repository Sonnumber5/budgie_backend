import pool from "../database";
import { Expense, ExpenseDTO } from "../types";
import { ExpenseQueries } from "../queries/expense.queries";

export class ExpenseDAO{
    async createExpense(expenseDTO: ExpenseDTO): Promise<Expense>{
        const result = await pool.query<Expense>(ExpenseQueries.CREATE_EXPENSE, [expenseDTO.userId, expenseDTO.categoryId, expenseDTO.vendor, expenseDTO.amount, expenseDTO.description, expenseDTO.expenseDate, expenseDTO.month]);
        return result.rows[0];
    }
}