import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const authRoutes = (authController: AuthController) => {
    const router = Router();
    
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/logout', authController.logout);
    router.get('/me', authenticate, authController.me);
    
    return router;
}