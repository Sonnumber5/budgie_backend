import { RequestHandler, Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { AuthRequest } from "../types";

export class CategoryController{

    constructor(private categoryService: CategoryService) {}
    
    createCategory = async (req: Request, res: Response): Promise<void>=> {
        try{
            const { name } = req.body;
            const userId = (req as AuthRequest).user.userId;

            if (!name){
                res.status(400).json({ error: 'Category name is required' });
                return;
            }
            const result = await this.categoryService.createCategory({ userId, name });
            res.status(201).json({
                message: 'Created category successfully', 
                category: result
            })
        } catch(error: any){
            console.error('Create category error:', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create category' });
        }
    }

    getCategories = async (req: Request, res: Response): Promise<void> => {
        try{
            const userId = (req as AuthRequest).user.userId;
            const result = await this.categoryService.getCategories(userId);

            if (result.length === 0){
                res.status(200).json({
                    message: 'No categories found',
                    categories: []
                })
            }
        res.status(200).json({
            message: 'Categories retrieved successfully',
            categories: result
        });

        } catch(error: any){
            console.error('Error retrieving categories', error);
            res.status(error.statusCode || 500).json({ error: error.message  || 'Failed to retreive categories' });
        }
    }
}