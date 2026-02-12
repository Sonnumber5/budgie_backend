import pool from "../database";
import { Category, CategoryDTO } from '../types';
import { CategoryQueries } from "../queries/category.queries";

export class CategoryDAO{
    async createCategory(userId: number, name: string): Promise<Category>{
        const result = await pool.query<Category>(CategoryQueries.CREATE_CATEGORY, [userId, name]);
        return result.rows[0];
    }

    async findCategoryByName(userId: number, name: string): Promise<Category>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_NAME, [userId, name]);
        return result.rows[0];
    }

    async findCategories(userId: number): Promise<Category[]>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORIES, [userId]);
        return result.rows;
    }

    async findCategoryById(userId: number, id: number): Promise<Category>{
        const result = await pool.query<Category>(CategoryQueries.FIND_CATEGORY_BY_ID, [userId, id]);
        return result.rows[0];
    }
}