import pool from "../database";
import { AccountBalanceQueries } from "../queries/accountBalance.queries";
import { AccountBalance, AccountBalanceDTO } from "../types";

// Data access layer for account balance database operations.
export class AccountBalanceDAO{
    // Inserts a new account balance row and returns the created record.
    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.CREATE_ACCOUNT_BALANCE, [userId, accountBalanceDTO.accountName, accountBalanceDTO.accountType, accountBalanceDTO.balance]);
        return result.rows[0];
    }

    // Returns all account balance rows for the user.
    async findAccountBalances(userId: number): Promise<AccountBalance[]>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.FIND_ACCOUNT_BALANCES, [userId]);
        return result.rows;
    }

    // Returns a single account balance row by ID.
    async findAccountBalanceById(userId: number, id: number): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.FIND_ACCOUNT_BALANCE_BY_ID, [userId, id]);
        return result.rows[0];
    }

    // Updates an account balance row and returns the updated record.
    async updateAccountBalance(userId: number, id: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.UPDATE_ACCOUNT_BALANCE, [accountBalanceDTO.accountName, accountBalanceDTO.accountType, accountBalanceDTO.balance, userId, id]);
        return result.rows[0];
    }

    // Deletes an account balance row and returns true if a row was removed.
    async deleteAccountBalance(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.DELETE_ACCOUNT_BALANCE, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // Deletes all account balance rows for the user and returns true if any were removed.
    async clearAccountBalances(userId: number): Promise<boolean>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.DELETE_ALL_ACCOUNT_BALANCES, [userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // Resets all account balances to zero for the user and returns true if any were updated.
    async resetAccountBalances(userId: number): Promise<boolean>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.RESET_ACCOUNT_BALANCES, [userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
