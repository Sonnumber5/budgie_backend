import pool from "../database";
import { IncomeDTO, Income } from "../types";
import { IncomeQueries } from "../queries/income.queries";
import { endOfMonth } from "date-fns";

export class IncomeDAO{
    async createIncome(userId: number, amount: string, source: string, description: string, incomeDate: string, month: string): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.CREATE_INCOME, [userId, amount, source, description, incomeDate, month]);
        return result.rows[0];
    }

    async findIncomeByMonth(userId: number, month: string): Promise<Income[]>{
        const result = await pool.query<Income>(IncomeQueries.FIND_INCOME_BY_MONTH, [userId, month]);
        return result.rows;
    }

    async findAllIncome(userId: number): Promise<Income[]>{
        const result = await pool.query<Income>(IncomeQueries.FIND_ALL_INCOME, [userId]);
        return result.rows;
    }

    async findIncomeById(userId: number, id: number): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.FIND_INCOME_BY_ID, [userId, id]);
        return result.rows[0];
    }
}