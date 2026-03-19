import { AccountBalanceDAO } from "../dao/accountBalance.dao";
import { AccountBalance, AccountBalanceDTO } from "../types";
import { AppError } from "../utils/AppError";

export class AccountBalanceService{
    constructor(private accountBalanceDAO: AccountBalanceDAO){}

    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        return await this.accountBalanceDAO.createAccountBalance(userId, accountBalanceDTO);
    }

    async getAccountBalances(userId: number): Promise<AccountBalance[]>{
        return await this.accountBalanceDAO.findAccountBalances(userId);
    }

    async getAccountBalanceById(userId: number, id: number): Promise<AccountBalance>{
        const result = await this.accountBalanceDAO.findAccountBalanceById(userId, id);
        if (!result){
            throw new AppError('Account balance not found', 404);
        }
        return result;
    }

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

    async deleteAccountBalance(userId: number, id: number): Promise<void>{
        const result = await this.accountBalanceDAO.deleteAccountBalance(userId, id);
        if (!result){
            throw new AppError('Account balance not found', 404);
        }
    }

    async resetAccountBalance(userId: number): Promise<void>{
        const result = await this.accountBalanceDAO.resetAccountBalances(userId);
        if (!result){
            throw new AppError('Account balances not found', 404);
        }
    }
}