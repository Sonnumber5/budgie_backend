import pool from "../database";
import { Category, CategoryDTO } from '../types';
import { CategoryQueries } from "../queries/category.queries";

// Data access layer for category database operations.
export class CategoryDAO{
    // Inserts a new category row and returns the created record.
    async createCategory(categoryDTO: CategoryDTO): Promise<Category>{
        const result = await pool.query<Category>(CategoryQueries.CREATE_CATEGORY, [categoryDTO.userId, categoryDTO.name]);
        if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }
        return result.rows[0];
    }

    // Returns a category by name, or null if not found.
    async findCategoryByName(userId: number, name: string): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_NAME, [userId, name]);
        return result.rows[0] ?? null;
    }

    // Returns all categories for the user.
    async findCategories(userId: number): Promise<Category[]>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORIES, [userId]);
        return result.rows;
    }

    // Returns a category by its ID, or null if not found.
    async findCategoryById(userId: number, id: number): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_ID, [userId, id]);
        return result.rows[0] ?? null;
    }

    // Updates a category's name and returns the updated record, or null if not found.
    async updateCategory(categoryDTO: CategoryDTO): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.UPDATE_CATEGORY, [categoryDTO.name, categoryDTO.id, categoryDTO.userId]);
        return result.rows[0] ?? null;
    }

    // Deletes a category row and returns true if a row was removed.
    async deleteCategory(id: number, userId: number): Promise<boolean>{
        const result = await pool.query<Category>(CategoryQueries.DELETE_CATEGORY, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
