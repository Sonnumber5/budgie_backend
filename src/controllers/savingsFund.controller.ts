import { Request, Response, NextFunction } from "express";
import { SavingsFundService } from "../services/savingsFund.service";
import { AuthRequest, SavingsFundDTO } from "../types";

export class SavingsFundController{
    constructor (private savingsFundService: SavingsFundService){}

    createSavingsFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { name, goal } = req.body;

            if (!name){
                res.status(400).json({ error: 'name is required' });
                return;
            }

            const parsedGoal = Number(goal);
            if (isNaN(parsedGoal) || parsedGoal <= 0) {
                res.status(400).json({ error: 'Goal must be a positive number' });
                return;
            }
            const fundToAdd: SavingsFundDTO = {
                name,
                goal
            }
            const result = await this.savingsFundService.createSavingsFund(userId, fundToAdd);
            res.status(201).json({
                message: 'Successfully created savings fund',
                savingsFund: result
             });
        } catch(error: any){
            next(error);
        }
    }

    getSavingsFundById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid savings fund id' });
                return;
            }
            const result = await this.savingsFundService.getSavingsFundById(userId, id);
            res.status(200).json({
                message: 'Successfully retrieved savings fund',
                savingsFund: result
            });
        } catch(error: any){
            next(error);
        }
    }

    getSavingsFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const includeArchived = req.query.includeArchived === "true";

            const result = await this.savingsFundService.getSavingsFunds(userId, includeArchived);

            res.status(200).json({
                message: 'Successfully retrieved savings funds',
                savingsFunds: result
            });
        } catch(error: any){
            next(error);
        }
    }

    updateSavingsFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { name, goal } = req.body;
            const id = parseInt(req.params.id as string);

            if (!name){
                res.status(400).json({ error: 'name is required' });
                return;
            }
            const parsedGoal = Number(goal);
            if (isNaN(parsedGoal) || parsedGoal <= 0) {
                res.status(400).json({ error: 'Goal must be a positive number' });
                return;
            }
            const fundToUpdate: SavingsFundDTO = {
                id,
                name,
                goal
            }
            const result = await this.savingsFundService.updateSavingsFund(userId, fundToUpdate);
            res.status(200).json({
                message: 'Successfully updated savings fund',
                savingsFund: result
             });
        } catch(error: any){
            next(error);
        }
    }

    deleteSavingsFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string)

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid savings fund id' });
                return;
            }

            await this.savingsFundService.deleteSavingsFund(userId, id);

            res.status(200).json({ message: 'Successfully deleted savings fund'});
        } catch(error: any){
            next(error);
        }
    }

    archiveSavingsFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const id = parseInt(req.params.id as string);

            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid savings fund id' });
                return;
            }

            const archivedFund = await this.savingsFundService.archiveSavingsFund(userId, id);
            res.status(200).json({ message: 'Successfully archived savings fund', savingsFund: archivedFund });
        } catch(error: any){
            next(error);
        }
    }
}
