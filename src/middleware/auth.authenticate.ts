import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

// Middleware that verifies the JWT from the request cookie and attaches the decoded user to the request.
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
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

        (req as AuthRequest).user = decoded;

        next();
    } catch(error){
        return res.status(403).json({ error: 'Invalid token' });
    }
}
