import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const authRoutes = (authController: AuthController) => {
    const router = Router();
    
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    
    return router;
}