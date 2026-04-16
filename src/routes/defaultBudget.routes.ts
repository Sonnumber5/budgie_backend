import { Router } from "express";
import { DefaultBudgetController } from "../controllers/defaultBudget.controller";
import { authenticate } from "../middleware/auth.authenticate";


export const defaultBudgetRoutes = (defaultBudgetController: DefaultBudgetController) => {
    const router = Router();

    router.post('/default-budgets', authenticate, defaultBudgetController.saveDefaultBudget);
    router.get('/default-budgets', authenticate, defaultBudgetController.getDefaultBudgetByUserId);
    
    return router;
}