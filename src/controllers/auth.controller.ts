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

            const result = await this.authService.register({email, password, name});

            res.status(201).json({
                message: 'User created successfully',
                user: result.user
            });
        } catch(error){
            console.error('Registration error:', error);
            res.status(500).json({
                error: 'Error registering user',
                details: ''
            })
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try{
            const {email, password} = req.body;
            
            if (!email || !password){
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            const result = await this.authService.login({ email, password });

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
        } catch(error){
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
}