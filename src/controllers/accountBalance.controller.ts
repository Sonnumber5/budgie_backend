import { AccountBalanceService } from "../services/accountBalance.service";
import { AccountBalanceDTO, AccountType, AuthRequest } from "../types";
import { Request, Response, NextFunction } from "express";


export class AccountBalanceController{
    constructor(private accountBalanceService: AccountBalanceService){}

    createAccountBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            if (isNaN(parsedBalance) || parsedBalance <= 0){
                res.status(400).json({ error: 'Balance is required and must be a positive number (even if the account type is a liability)' });
                return;
            }

            const accountBalanceDTO: AccountBalanceDTO = {
                accountName,
                accountType,
                balance
            }

            const result = await this.accountBalanceService.createAccountBalance(userId, accountBalanceDTO);

            res.status(201).json({
                message: 'Successfully created account balance',
                accountBalance: result
            });
        } catch(error: any){
            next(error);
        }
    }

    getAccountBalances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const result = await this.accountBalanceService.getAccountBalances(userId);

            res.status(200).json({
                message: 'Successfully retrieved account balance',
                accountBalances: result
            });
        } catch(error: any){
            next(error);
        }
    }

    getAccountBalanceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id) || id <= 0){
                res.status(400).json({ error: 'id is required' });
                return;
            }

            const result = await this.accountBalanceService.getAccountBalanceById(userId, id);

            res.status(200).json({
                message: 'Successfully retrieved account balance',
                accountBalance: result
            });
        } catch(error: any){
            next(error);
        }
    }

    updateAccountBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { accountName, accountType, balance } = req.body;
            const id = parseInt(req.params.id as string);

            if (!accountName){
                res.status(400).json({ error: 'Account name is required' });
                return;
            }

            if (isNaN(id) || id <= 0){
                res.status(400).json({ error: 'id is required' });
                return;
            }

            const validAccountTypes: AccountType[] = ["Asset", "Liability"];
            if (!accountType || !validAccountTypes.includes(accountType)){
                res.status(400).json({ error: 'Account type is required and must be either asset or liability' });
                return;
            }

            const parsedBalance = Number(balance);
            if (isNaN(parsedBalance) || parsedBalance < 0){
                res.status(400).json({ error: 'Balance is required and must be a positive number' });
                return;
            }

            const accountBalanceDTO: AccountBalanceDTO = {
                accountName,
                accountType,
                balance
            }

            const result = await this.accountBalanceService.updateAccountBalance(userId, id, accountBalanceDTO);

            res.status(200).json({
                message: 'Successfully updated account balance',
                accountBalance: result
            });
        } catch(error: any){
            next(error);
        }
    }

    deleteAccountBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id) || id <= 0){
                res.status(400).json({ error: 'id is required' });
                return;
            }

            await this.accountBalanceService.deleteAccountBalance(userId, id);

            res.status(200).json({ message: 'Successfully deleted account balance' });
        } catch(error: any){
            next(error);
        }
    }

    resetAccountBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            await this.accountBalanceService.resetAccountBalance(userId);

            res.status(200).json({ message: 'Successfully reset account balances' });
        } catch(error: any){
            next(error);
        }
    }
}
