import pool from "../database"
import { SavingsFundQueries } from "../queries/savingsFund.queries"
import { SavingsFund, SavingsFundDTO } from "../types"
import { AppError } from "../utils/AppError";

// Data access layer for savings fund database operations.
export class SavingsFundDAO{
    // Inserts a new savings fund row and returns the created record.
    async createSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.CREATE_SAVINGS_FUND, [userId, savingsFundDTO.name, savingsFundDTO.goal]);
        return result.rows[0];
    }

    // Returns an active savings fund by name, or null if not found.
    async findSavingsFundByName(userId: number, name: string): Promise<SavingsFund | null>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_ACTIVE_SAVINGS_FUND_BY_NAME, [userId, name]);
        return result.rows[0];
    }

    // Returns a savings fund by its ID, or null if not found.
    async findSavingsFundById(userId: number, id: number): Promise<SavingsFund | null>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_SAVINGS_FUND_BY_ID, [userId, id]);
        return result.rows[0];
    }

    // Returns all active (non-archived) savings funds for the user.
    async findActiveSavingsFunds(userId: number): Promise<SavingsFund[]>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_ACTIVE_SAVINGS_FUNDS, [userId]);
        return result.rows;
    }

    // Returns all archived savings funds for the user.
    async findArchivedSavingsFunds(userId: number): Promise<SavingsFund[]>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.FIND_ARCHIVED_SAVINGS_FUNDS, [userId]);
        return result.rows;
    }

    // Updates a savings fund's name and goal and returns the updated record.
    async updateSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.UPDATE_SAVINGS_FUND, [savingsFundDTO.name, savingsFundDTO.goal, userId, savingsFundDTO.id]);
        return result.rows[0];
    }

    // Sets the archived_at timestamp on a savings fund and returns the updated record.
    async archiveSavingsFund(userId: number, id: number): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.ARCHIVE_FUND, [userId, id]);
        return result.rows[0];
    }

    // Removes the archived_at timestamp on a savings fund and returns the updated record.
    async unarchiveSavingsFund(userId: number, id: number): Promise<SavingsFund>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.UNARCHIVE_FUND, [userId, id]);
        return result.rows[0];
    }

    // Deletes a savings fund row and returns true if a row was removed.
    async deleteSavingsFund(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<SavingsFund>(SavingsFundQueries.DELETE_SAVINGS_FUND, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
