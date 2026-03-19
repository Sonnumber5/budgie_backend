import pool from "../database";
import { Category, CategoryDTO } from '../types';
import { CategoryQueries } from "../queries/category.queries";

export class CategoryDAO{
    async createCategory(categoryDTO: CategoryDTO): Promise<Category>{
        const result = await pool.query<Category>(CategoryQueries.CREATE_CATEGORY, [categoryDTO.userId, categoryDTO.name]);
        if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }
        return result.rows[0];
    }

    async findCategoryByName(userId: number, name: string): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_NAME, [userId, name]);
        return result.rows[0] ?? null;
    }

    async findCategories(userId: number): Promise<Category[]>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORIES, [userId]);
        return result.rows;
    }

    async findCategoryById(userId: number, id: number): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_ID, [userId, id]);
        return result.rows[0] ?? null;
    }

    async updateCategory(categoryDTO: CategoryDTO): Promise<Category | null>{
        const result = await pool.query<Category>(CategoryQueries.UPDATE_CATEGORY, [categoryDTO.name, categoryDTO.id, categoryDTO.userId]);
        return result.rows[0] ?? null;
    }

    async deleteCategory(id: number, userId: number): Promise<boolean>{
        const result = await pool.query<Category>(CategoryQueries.DELETE_CATEGORY, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}