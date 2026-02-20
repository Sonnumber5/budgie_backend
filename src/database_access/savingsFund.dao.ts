import pool from "../database"
import { SavingsFundQueries } from "../queries/savingsFund.queries"
import { SavingsFund, SavingsFundDTO } from "../types"
import { AppError } from "../utils/AppError";

export class SavingsFundDAO{
    async createSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.CREATE_SAVINGS_FUND, [userId, savingsFundDTO.name, savingsFundDTO.goal]);
        return result.rows[0];
    }

    async findSavingsFundByName(userId: number, name: string): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_ACTIVE_SAVINGS_FUND_BY_NAME, [userId, name]);
        return result.rows[0];
    }

    async findSavingsFundById(userId: number, id: number): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_SAVINGS_FUND_BY_ID, [userId, id]);
        return result.rows[0];
    }

    async findSavingsFunds(userId: number): Promise<SavingsFund[]>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_SAVINGS_FUNDS, [userId]);
        return result.rows;
    }
}