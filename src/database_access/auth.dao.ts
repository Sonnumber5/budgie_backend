import pool from "../database";
import { User } from "../types";
import { AuthQueries } from "../queries/auth.queries";

export class AuthDAO {
    async createUser(email: string, passwordHash: string, name: string): Promise<User>{
        const result = await pool.query<User>(AuthQueries.CREATE_USER, [email, passwordHash, name]);
        return result.rows[0];
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