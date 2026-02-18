import { Router } from "express"
import { MonthlyBudgetController } from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const BudgetRoutes = (monthlyBudgetController: MonthlyBudgetController) => {
    const router = Router();

    router.post('/budgets/monthly', authenticate, monthlyBudgetController.createMonthlyBudget);
    router.get('/budgets/monthly/:id', authenticate, monthlyBudgetController.getBudgetByMonthlyBudgetId);
    router.get('/budgets/monthly/', authenticate, monthlyBudgetController.getBudgetByMonth);


    return router;
}