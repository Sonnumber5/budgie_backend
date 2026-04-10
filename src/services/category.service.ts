import { CategoryDAO } from "../dao/category.dao";
import { Category, CategoryDTO } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for category management operations.
export class CategoryService{

    constructor(private categoryDAO: CategoryDAO){}

    // Creates a new category, throwing 409 if one with the same name already exists.
    async createCategory(categoryDTO: CategoryDTO): Promise<Category>{

        const existingCategory = await this.categoryDAO.findCategoryByName(categoryDTO.userId, categoryDTO.name);
        if (existingCategory){
            throw new AppError("Category already exists", 409);
        }

        return await this.categoryDAO.createCategory(categoryDTO);
    }

    // Returns all categories for the user.
    async getCategories(userId: number): Promise<Category[]>{
        return await this.categoryDAO.findCategories(userId);
    }

    // Returns a category by ID, throwing 404 if not found.
    async getCategoryById(userId: number, id: number): Promise<Category>{
        const category = await this.categoryDAO.findCategoryById(userId, id);
        if (!category){
            throw new AppError("Category not found", 404);
        }

        return category;
    }

    // Returns a category by name if it exists, or creates it if it doesn't.
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

    // Returns a category by name, throwing 404 if not found.
    async getCategoryByName(userId: number, name: string): Promise<Category>{
        let category = await this.categoryDAO.findCategoryByName(userId, name);
        if (!category){
            throw new AppError("Category not found", 404);
        }
        return category;
    }

    // Updates a category's name, throwing 409 if the new name is already taken.
    async updateCategory(categoryDTO: CategoryDTO): Promise<Category | null>{
        const existingCategory = await this.categoryDAO.findCategoryByName(categoryDTO.userId, categoryDTO.name);

        if (existingCategory){
            throw new AppError('Category already exists', 409);
        }

        const updatedCategory = await this.categoryDAO.updateCategory(categoryDTO);
        return updatedCategory ?? null;
    }

    // Deletes a category by ID, throwing 404 if not found.
    async deleteCategory(id: number, userId: number): Promise<void>{
        const result = await this.categoryDAO.deleteCategory(id, userId);
        if (!result){
            throw new AppError('Category not found', 404);
        }
    }
}
