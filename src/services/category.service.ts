import { CategoryDAO } from "../database_access/category.dao";
import { Category, CategoryDTO } from "../types";
import { AppError } from "../utils/AppError";

export class CategoryService{
    
    constructor(private categoryDAO: CategoryDAO){}

    async createCategory(category: CategoryDTO): Promise<Category>{
        
        const existingCategory = await this.categoryDAO.getCategoryByName(category.userId, category.name);
        if (existingCategory){
            throw new AppError("Category already exists", 409);
        }
        const newCategory = await this.categoryDAO.createCategory(category.userId, category.name);

        return newCategory;
    }

    async getCategories(userId: number): Promise<Category[]>{
        return await this.categoryDAO.getCategories(userId);
    }
}