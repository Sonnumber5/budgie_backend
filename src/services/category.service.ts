import { CategoryDAO } from "../database_access/category.dao";
import { Category, CategoryDTO } from "../types";
import { AppError } from "../utils/AppError";

export class CategoryService{
    
    constructor(private categoryDAO: CategoryDAO){}

    async createCategory(category: CategoryDTO): Promise<Category>{
        
        const existingCategory = await this.categoryDAO.findCategoryByName(category.userId, category.name);
        if (existingCategory){
            throw new AppError("Category already exists", 409);
        }

        const newCategory = await this.categoryDAO.createCategory(category.userId, category.name);
        return newCategory;
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

    async updateCategory(name: string, id: number, userId: number): Promise<Category>{
        const existingCategory = await this.categoryDAO.findCategoryByName(userId, name);
        
        if (existingCategory){
            throw new AppError('Category already exists', 409);
        }

        const updatedCategory = await this.categoryDAO.updateCategory(name, id, userId);
        return updatedCategory;
    }

    async deleteCategory(id: number, userId: number): Promise<boolean>{
        return this.categoryDAO.deleteCategory(id, userId);
    }
}