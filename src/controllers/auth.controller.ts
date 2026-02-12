import { RequestHandler, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest, User } from "../types";

export class AuthController{

    constructor(private authService: AuthService){}

    register = async (req: Request, res: Response): Promise<void> => {
        try{
            const { email, password, name } = req.body;

            if (!email || !password || !name){
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)){
                res.status(400).json({ Error: 'Invalid email format' });
            }

            if (password.length < 8){
                res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }

            if (!/[a-z]/.test(password)){
                res.status(400).json({ error: 'Password must have at least one lowercase letter' });
            }

            if (!/[A-Z]/.test(password)){
                res.status(400).json({ error: 'Password must have at least one uppercase letter' });
            }

            if (!/[0-9]/.test(password)){
                res.status(400).json({ error: 'Password must have at least one number' });
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
                res.status(400).json({ error: 'Password must have at least one special character' });
            }

            const result = await this.authService.register({email, password, name});

            res.status(201).json({
                message: 'User created successfully',
                user: result.user
            });
        } catch(error: any){
            console.error('Registration error:', error);
            res.status(error.statusCode || 400).json({ error: error.message || 'Error registering user' })
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try{
            const {email, password} = req.body;
            
            if (!email || !password){
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            const result = await this.authService.login(email, password);

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                message: 'Login successful',
                user: result.user
            });
        } catch(error: any){
            console.error('Login error:', error);
            res.status(error.statusCode || 500).json({ error: error.message || 'Login failed' });
        }
    }

    logout = (req: Request, res: Response): void => {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    }
}