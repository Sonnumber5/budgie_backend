import { RequestHandler, Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { AuthRequest } from "../types";

export class CategoryController{

    constructor(private categoryService: CategoryService) {}
    
    createCategory = async (req: Request, res: Response): Promise<void>=> {
        try{
            const { name } = req.body;
            const userId = (req as any).user.userId;

            if (!name){
                res.status(400).json({ error: 'Category name is required' });
                return;
            }

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }
            const result = await this.categoryService.createCategory({ userId, name });
            res.status(201).json({
                message: 'Created category successfully', 
                category: result.category
            })
        } catch(error: any){
            console.error('Create category error:', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create category' });
        }
    }
}