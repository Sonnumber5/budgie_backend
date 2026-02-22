import { AccountBalanceDAO } from "../database_access/accountBalance.dao";
import { AccountBalance, AccountBalanceDTO } from "../types";
import { AppError } from "../utils/AppError";

export class AccountBalanceService{
    constructor(private accountBalanceDAO: AccountBalanceDAO){}

    async createAccountBalance(userId: number, accountBalanceDTO: AccountBalanceDTO): Promise<AccountBalance>{
        const result = await this.accountBalanceDAO.createAccountBalance(userId, accountBalanceDTO);
        if (!result){
            throw new AppError('Failed to create account balance', 400);
        }
        return result;
    }
}