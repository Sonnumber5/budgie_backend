import pool from "../database";
import { AccountBalanceQueries } from "../queries/accountBalance.queries";
import { AccountBalance, AccountBalanceDTO } from "../types";

export class AccountBalanceDAO{
    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await pool.query<AccountBalance>(AccountBalanceQueries.CREATE_ACCOUNT_BALANCE, [userId, accountBalanceDTO.accountName, accountBalanceDTO.accountType, accountBalanceDTO.balance]);
        return result.rows[0];
    }
}