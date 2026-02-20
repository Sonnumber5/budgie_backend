import { Router } from "express"
import { MonthlyBudgetController } from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const BudgetRoutes = (monthlyBudgetController: MonthlyBudgetController) => {
    const router = Router();

    router.post('/budgets/monthly', authenticate, monthlyBudgetController.createMonthlyBudget);
    router.get('/budgets/monthly/:id', authenticate, monthlyBudgetController.getBudgetByMonthlyBudgetId);
    router.get('/budgets/monthly/', authenticate, monthlyBudgetController.getBudgetByMonth);
    router.put('/budgets/monthly/:id', authenticate, monthlyBudgetController.updateMonthlyBudget);
    router.delete('/budgets/monthly/:id', authenticate, monthlyBudgetController.deleteMonthlyBudget);
    router.delete('/budgets/categories/:id', authenticate, monthlyBudgetController.deleteCategoryBudget);
    router.put('/budgets/categories/:id', authenticate, monthlyBudgetController.updateCategoryBudget);


    return router;
}