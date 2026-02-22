import { AccountBalanceService } from "../services/accountBalance.service";
import { AccountBalance, AccountBalanceDTO, AccountType, AuthRequest } from "../types";
import { Request, Response } from "express";


export class AccountBalanceController{
    constructor(private accountBalanceService: AccountBalanceService){}

    createAccountBalance = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { accountName, accountType, balance } = req.body;

            if (!accountName){
                res.status(400).json({ error: 'Account name is required' });
                return;
            }

            const validAccountTypes: AccountType[] = ["Asset", "Liability"];
            if (!accountType || !validAccountTypes.includes(accountType)){
                res.status(400).json({ error: 'Account type is required and must be either asset or liability' });
                return;
            }

            const parsedBalance = Number(balance);
            if (!parsedBalance || parsedBalance <= 0){
                res.status(400).json({ error: 'Balance is required and must be a positive number (even if the account type is a liability)' });
                return;
            }

            const accountBalanceDTP: AccountBalanceDTO = {
                accountName,
                accountType,
                balance
            }

            const result = await this.accountBalanceService.createAccountBalance(userId, accountBalanceDTP);

            res.status(201).json({
                message: 'Successfully created account balance',
                accountBalance: result
            });
        } catch(error: any){
            console.log('Error creating account balance', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create account balance' });
        }
    }
}