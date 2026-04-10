import pool from "../database";
import { IncomeDTO, Income } from "../types";
import { IncomeQueries } from "../queries/income.queries";

// Data access layer for income database operations.
export class IncomeDAO{
    // Inserts a new income row and returns the created record.
    async createIncome(incomeDTO: IncomeDTO): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.CREATE_INCOME, [incomeDTO.userId, incomeDTO.amount, incomeDTO.source, incomeDTO.description, incomeDTO.incomeDate, incomeDTO.month]);
        return result.rows[0];
    }

    // Returns all income rows for the user filtered by month.
    async findIncomeByMonth(userId: number, month: string): Promise<Income[]>{
        const result = await pool.query<Income>(IncomeQueries.FIND_INCOME_BY_MONTH, [userId, month]);
        return result.rows;
    }

    // Returns all income rows for the user with no date filter.
    async findAllIncome(userId: number): Promise<Income[]>{
        const result = await pool.query<Income>(IncomeQueries.FIND_ALL_INCOME, [userId]);
        return result.rows;
    }

    // Returns a single income row by its ID.
    async findIncomeById(userId: number, id: number): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.FIND_INCOME_BY_ID, [userId, id]);
        return result.rows[0];
    }

    // Updates an income row and returns the updated record.
    async updateIncome(incomeDTO: IncomeDTO): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.UPDATE_INCOME, [incomeDTO.amount, incomeDTO.source, incomeDTO.description, incomeDTO.incomeDate, incomeDTO.month, incomeDTO.id, incomeDTO.userId]);
        return result.rows[0];
    }

    // Deletes an income row and returns true if a row was removed.
    async deleteIncome(id: number, userId: number): Promise<boolean>{
        const result = await pool.query<Income>(IncomeQueries.DELETE_INCOME, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // Returns the total sum of all income for the given month.
    async findMonthlyIncomeSum(userId: number, month: string): Promise<number>{
        const result =  await pool.query(IncomeQueries.FIND_INCOME_SUM_FOR_MONTH, [userId, month]);
        return result.rows[0].income_sum;
    }
}
