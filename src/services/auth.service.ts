import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthDAO } from '../dao/auth.dao';
import { RegisterDTO, LoginDTO, AuthResponse } from '../types';
import { AppError } from '../utils/AppError';

// Business logic layer for user authentication, handling registration, login, and user lookup.
export class AuthService{

    constructor(private authDAO: AuthDAO){}

    // Checks for duplicate emails, hashes the password, and creates a new user.
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

    // Verifies credentials and returns a signed JWT along with the user's info.
    async login(loginDTO: LoginDTO): Promise<AuthResponse>{

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

    // Returns a user's public info by their ID, throwing 404 if not found.
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
