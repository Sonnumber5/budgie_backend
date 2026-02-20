import { CategoryDAO } from "../database_access/category.dao";
import { Category, CategoryDTO } from "../types";
import { AppError } from "../utils/AppError";

export class CategoryService{
    
    constructor(private categoryDAO: CategoryDAO){}

    async createCategory(categoryDTO: CategoryDTO): Promise<Category>{
        
        const existingCategory = await this.categoryDAO.findCategoryByName(categoryDTO.userId, categoryDTO.name);
        if (existingCategory){
            throw new AppError("Category already exists", 409);
        }

        return await this.categoryDAO.createCategory(categoryDTO);
    }

    async getCategories(userId: number): Promise<Category[]>{
        return await this.categoryDAO.findCategories(userId);
    }

    async getCategoryById(userId: number, id: number): Promise<Category>{
        const category = await this.categoryDAO.findCategoryById(userId, id);
        if (!category){
            throw new AppError("Category not found", 404);
        }

        return category;
    }

    async getOrCreateCategory(userId: number, name: string): Promise<Category>{
        let category = await this.categoryDAO.findCategoryByName(userId, name);
        if (!category){
            category = await this.categoryDAO.createCategory({userId, name});
            if (!category){
                throw new AppError("Failed to create category", 500);
            }
        }
        return category;
    }

    async getCategoryByName(userId: number, name: string): Promise<Category>{
        let category = await this.categoryDAO.findCategoryByName(userId, name);
        if (!category){
            throw new AppError("Failed to create category", 500);
        }
        return category;
    }

    async updateCategory(categoryDTO: CategoryDTO): Promise<Category | null>{
        const existingCategory = await this.categoryDAO.findCategoryByName(categoryDTO.userId, categoryDTO.name);
        
        if (existingCategory){
            throw new AppError('Category already exists', 409);
        }

        const updatedCategory = await this.categoryDAO.updateCategory(categoryDTO);
        return updatedCategory ?? null;
    }

    async deleteCategory(id: number, userId: number): Promise<void>{
        const result = this.categoryDAO.deleteCategory(id, userId);
        if (!result){
            throw new AppError('Category not found', 404);
        }
    }
}