import { FundTransactionDTO, FundTransaction } from "../types";
import pool from "../database";
import { FundTransactionQueries } from "../queries/fundTransaction.queries";

export class FundTransactionDAO{
    async createFundTransaction(userId: number, fundTransactionDTO: FundTransactionDTO): Promise<FundTransaction>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.CREATE_FUND_TRANSACTION, [userId, fundTransactionDTO.savingsFundId, fundTransactionDTO.transactionType, fundTransactionDTO.amount, fundTransactionDTO.description, fundTransactionDTO.transactionDate]);
        return result.rows[0];
    }

    async findFundTransactions(userId: number, fundId: number): Promise<FundTransaction[]>{
        const result = await pool.query<FundTransaction>(FundTransactionQueries.FIND_FUND_TRANSACTIONS, [userId, fundId]);
        return result.rows;
    }
}