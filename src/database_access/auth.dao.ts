import pool from "../database";
import { Category, User } from "../types";
import { AuthQueries } from "../queries/auth.queries";
import { CategoryQueries } from "../queries/category.queries";
import { AppError } from "../utils/AppError";

export class AuthDAO {
    async createUser(email: string, passwordHash: string, name: string): Promise<User>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            const result = await client.query<User>(AuthQueries.CREATE_USER, [email, passwordHash, name]);
            const newUser = result.rows[0];

            await client.query<Category>(CategoryQueries.CREATE_CATEGORY, [newUser.id, 'Uncategorized']);
            await client.query('COMMIT');
            return newUser;
        } catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to create user and default category:', error);
            throw error;
        } finally{
            client.release();
        }
    }

    async findUserById(userId: number): Promise<User | null>{
        const result = await pool.query<User>(AuthQueries.FIND_USER_BY_ID, [userId]);
        return result.rows[0] || null;
    }

    async findUserByEmail(email: string): Promise<User | null>{
        const result = await pool.query<User>(AuthQueries.FIND_USER_BY_EMAIL, [email]);
        return result.rows[0] || null;
    }
    
    
}