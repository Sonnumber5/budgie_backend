import bcrypt from 'bcrypt';
import { Jwt } from 'jsonwebtoken';
import { AuthDAO } from '../database_access/auth.dao';
import { RegisterDTO, loginDTO, AuthResponse } from '../types';

export class AuthService{
    constructor(private authDAO: AuthDAO){}

    async register(data: RegisterDTO): Promise<{user: {id: number; email: string; name: string}}>{
        const { email, password, name } = data;

        const existingUser = await this.authDAO.findUserByEmail(email);

        if (existingUser){
            throw new Error('User already exists');
        }

        if (password.length < 12){
            throw new Error('Password must be at least 12 characters');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await this.authDAO.createUser(email, passwordHash, name);

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            }
        };
    }
}