import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { AuthRequest, CategoryDTO } from "../types";

// Handles HTTP requests for category management operations.
export class CategoryController{

    constructor(private categoryService: CategoryService) {}

    // Validates input and creates a new category for the authenticated user.
    createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const { name } = req.body;

            if (!name){
                res.status(400).json({ error: 'Category name is required' });
                return;
            }

            const categoryDTO: CategoryDTO = {
                userId,
                name
            }

            const result = await this.categoryService.createCategory(categoryDTO);
            res.status(201).json({
                message: 'Created category successfully',
                category: result
            })
        } catch(error: any){
            next(error);
        }
    }

    // Retrieves all categories belonging to the authenticated user.
    getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const result = await this.categoryService.getCategories(userId);

            res.status(200).json({
                message: 'Categories retrieved successfully',
                categories: result
            });

        } catch(error: any){
            next(error);
        }
    }

    // Retrieves a single category by its ID for the authenticated user.
    getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const categoryId = parseInt(req.params.id as string);

            if (isNaN(categoryId)){
                res.status(400).json({ error: 'Invalid category id' });
                return;
            }
            const result = await this.categoryService.getCategoryById(userId, categoryId);

            res.status(200).json({
                message: 'Category retrieved successfully',
                category: result
            });
        } catch(error: any){
            next(error);
        }
    }

    // Validates input and updates the name of an existing category.
    updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const id = parseInt(req.params.id as string);
            const { name } = req.body;

            if (!name){
                res.status(400).json({ error: 'Category name is required' });
                return;
            }
            if (isNaN(id)){
                res.status(400).json({ error: 'Invalid category id' });
                return;
            }

            const categoryDTO: CategoryDTO = {
                id,
                userId,
                name
            }

            const result = await this.categoryService.updateCategory(categoryDTO);
            res.status(200).json({
                message: 'Category updated successfully',
                category: result
             })
        } catch(error: any){
            next(error);
        }
    }

    // Deletes a category by its ID for the authenticated user.
    deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const authRequest = req as AuthRequest;
            if (!authRequest.user){
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = authRequest.user.userId;

            const categoryId = parseInt(req.params.id as string);

            if (isNaN(categoryId)){
                res.status(400).json({ error: 'Invalid category id' });
                return;
            }

            await this.categoryService.deleteCategory(categoryId, userId);

            res.status(200).json({ message: 'Category successfully deleted' });
        } catch(error: any){
            next(error);
        }
    }
}
