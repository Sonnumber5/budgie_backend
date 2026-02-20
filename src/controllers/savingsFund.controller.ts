import { Request, Response } from "express";
import { SavingsFundService } from "../services/savingsFund.service";
import { AuthRequest, SavingsFundDTO } from "../types";

export class SavingsFundController{
    constructor (private savingsFundService: SavingsFundService){}

    createSavingsFund = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;
            const { name, goal } = req.body;
            
            if (!name || !goal){
                res.status(400).json({ error: 'name and goal are required' });
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
        }catch(error: any){
            console.log('Error creating savings fund', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create savings fund' });
        }
    }

    getSavingsFundById = async (req: Request, res: Response): Promise<void> => {
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
        }catch(error: any){
            console.log('Error retrieving savings fund', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve savings fund' });
        }
    }

    getSavingsFunds = async (req: Request, res: Response): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const result = await this.savingsFundService.getSavingsFunds(userId);
            res.status(200).json({ 
                message: 'Successfully retrieved savings funds',
                savingsFunds: result
            });
        }catch(error: any){
            console.log('Error retrieving savings funds', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve savings funds' });
        }
    }
}