import { Router } from "express"
import { MonthlyBudgetController } from "../controllers/monthlyBudget.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const MonthlyBudgetRoutes = (monthlyBudgetController: MonthlyBudgetController) => {
    const router = Router();

    router.post('/budgets/monthly', authenticate, monthlyBudgetController.createMonthlyBudget);

    return router;
}