import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

    async login(data: loginDTO): Promise<AuthResponse>{
        const { email, password } = data;

        const user = await this.authDAO.findUserByEmail(email);
        if (!user){
            throw new Error('User does not exist');
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword){
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h'}
        );
        
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }
    }


}