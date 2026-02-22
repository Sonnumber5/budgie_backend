import pool from "../database";
import { AccountBalanceQueries } from "../queries/accountBalance.queries";
import { AccountBalance, AccountBalanceDTO } from "../types";

export class AccountBalanceDAO{
    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.CREATE_ACCOUNT_BALANCE, [userId, accountBalanceDTO.accountName, accountBalanceDTO.accountType, accountBalanceDTO.balance]);
        return result.rows[0];
    }

    async findAccountBalances(userId: number): Promise<AccountBalance[]>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.FIND_ACCOUNT_BALANCES, [userId]);
        return result.rows;
    }

    async findAccountBalanceById(userId: number, id: number): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.FIND_ACCOUNT_BALANCE_BY_ID, [userId, id]);
        return result.rows[0];
    }

    async updateAccountBalance(userId: number, id: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.UPDATE_ACCOUNT_BALANCE, [accountBalanceDTO.accountName, accountBalanceDTO.accountType, accountBalanceDTO.balance, userId, id]);
        return result.rows[0];
    }

    async deleteAccountBalance(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.DELETE_ACCOUNT_BALANCE, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    async resetAccountBalances(userId: number): Promise<boolean>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.DELETE_ALL_ACCOUNT_BALANCES, [userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}