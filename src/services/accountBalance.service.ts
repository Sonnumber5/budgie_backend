import { AccountBalanceDAO } from "../dao/accountBalance.dao";
import { AccountBalance, AccountBalanceDTO } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for account balance operations, delegating persistence to AccountBalanceDAO.
export class AccountBalanceService{
    constructor(private accountBalanceDAO: AccountBalanceDAO){}

    // Creates a new account balance record for the user.
    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        return await this.accountBalanceDAO.createAccountBalance(userId, accountBalanceDTO);
    }

    // Returns all account balances for the user.
    async getAccountBalances(userId: number): Promise<AccountBalance[]>{
        return await this.accountBalanceDAO.findAccountBalances(userId);
    }

    // Returns a single account balance by ID, throwing 404 if not found.
    async getAccountBalanceById(userId: number, id: number): Promise<AccountBalance>{
        const result = await this.accountBalanceDAO.findAccountBalanceById(userId, id);
        if (!result){
            throw new AppError('Account balance not found', 404);
        }
        return result;
    }

    // Updates an existing account balance, throwing 404 if it doesn't exist.
    async updateAccountBalance(userId: number, id: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const existingAccountBalance = await this.accountBalanceDAO.findAccountBalanceById(userId, id);
        if (!existingAccountBalance){
            throw new AppError('Account balance not found', 404);
        }
        const result = await this.accountBalanceDAO.updateAccountBalance(userId, id, accountBalanceDTO);
        if (!result){
            throw new AppError('Failed to update account balance', 400);
        }
        return result;
    }

    // Deletes an account balance, throwing 404 if it doesn't exist.
    async deleteAccountBalance(userId: number, id: number): Promise<void>{
        const result = await this.accountBalanceDAO.deleteAccountBalance(userId, id);
        if (!result){
            throw new AppError('Account balance not found', 404);
        }
    }

    // Resets all account balances for the user to zero.
    async resetAccountBalance(userId: number): Promise<void>{
        const result = await this.accountBalanceDAO.resetAccountBalances(userId);
        if (!result){
            throw new AppError('Account balances not found', 404);
        }
    }
}