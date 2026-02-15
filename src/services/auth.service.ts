import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthDAO } from '../database_access/auth.dao';
import { RegisterDTO, loginDTO, AuthResponse } from '../types';
import { AppError } from '../utils/AppError';

export class AuthService{
    
    constructor(private authDAO: AuthDAO){}

    async register(registerDTO: RegisterDTO): Promise<{user: {id: number; email: string; name: string}}>{

        const existingUser = await this.authDAO.findUserByEmail(registerDTO.email);

        if (existingUser){
            throw new AppError('User already exists', 409);
        }

        const passwordHash = await bcrypt.hash(registerDTO.password, 10);
        registerDTO.password = passwordHash;

        const newUser = await this.authDAO.createUser(registerDTO);

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            }
        };
    }

    async login(loginDTO: loginDTO): Promise<AuthResponse>{

        const user = await this.authDAO.findUserByEmail(loginDTO.email);
        if (!user){
            throw new AppError('Invalid credentials', 401);
        }

        const validPassword = await bcrypt.compare(loginDTO.password, user.passwordHash);
        if (!validPassword){
            throw new AppError('Invalid credentials', 401);
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

    async getUserById(userId: number){
        const user = await this.authDAO.findUserById(userId);
        if (!user){
            throw new AppError('User not found', 404);
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}