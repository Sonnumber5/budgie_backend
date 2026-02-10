import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        name: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token;

        if (!token){
            return res.status(401).json({error: 'Not authenticated'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
            email: string;
            name: string;
        };

        req.user = decoded;

        next();
    } catch(error){
        return res.status(403).json({ error: 'Invalud token' });
    }

}