import { Router } from "express"
import { BudgetController } from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.authenticate";

// Registers monthly and category budget routes on a new Express router and returns it.
export const budgetRoutes = (budgetController: BudgetController) => {
    const router = Router();

    router.post('/budgets/monthly', authenticate, budgetController.createMonthlyBudget);
    router.get('/budgets/monthly/:id', authenticate, budgetController.getBudgetByMonthlyBudgetId);
    router.get('/budgets/monthly/', authenticate, budgetController.getBudgetByMonth);
    router.put('/budgets/monthly/:id', authenticate, budgetController.updateMonthlyBudget);
    router.delete('/budgets/monthly/:id', authenticate, budgetController.deleteMonthlyBudget);
    router.get('/budgets/categories/:id', authenticate, budgetController.getCategoryBudgetById);
    router.put('/budgets/categories/:id', authenticate, budgetController.updateCategoryBudget);
    router.delete('/budgets/categories/:id', authenticate, budgetController.deleteCategoryBudget);

    return router;
}
