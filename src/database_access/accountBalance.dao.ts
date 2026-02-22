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
}