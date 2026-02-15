import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const ExpenseRoutes = (expenseController: ExpenseController) => {
    const router = Router();

    router.post('/expenses', authenticate, expenseController.createExpense);
    router.get('/expenses', authenticate, expenseController.getExpenses);
    router.get('/expenses/:id', authenticate, expenseController.getExpenseById);

    return router;
}