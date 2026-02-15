import pool from "../database";
import { IncomeDTO, Income } from "../types";
import { IncomeQueries } from "../queries/income.queries";
import { endOfMonth } from "date-fns";

export class IncomeDAO{
    async createIncome(incomeDTO: IncomeDTO): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.CREATE_INCOME, [incomeDTO.userId, incomeDTO.amount, incomeDTO.source, incomeDTO.description, incomeDTO.incomeDate, incomeDTO.month]);
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

    async updateIncome(incomeDTO: IncomeDTO): Promise<Income>{
        const result = await pool.query<Income>(IncomeQueries.UPDATE_INCOME, [incomeDTO.amount, incomeDTO.source, incomeDTO.description, incomeDTO.incomeDate, incomeDTO.month, incomeDTO.id, incomeDTO.userId]);
        return result.rows[0];
    }

    async deleteIncome(id: number, userId: number): Promise<boolean>{
        const result = await pool.query<Income>(IncomeQueries.DELETE_INCOME, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}