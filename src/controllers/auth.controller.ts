import { RequestHandler, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types";

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
            res.status(400).json({
                error: 'Error registering user',
                details: ''
            })
        }
    }
}