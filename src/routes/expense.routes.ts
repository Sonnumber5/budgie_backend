import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const ExpenseRoutes = (expenseController: ExpenseController) => {
    const router = Router();

    router.post('/expenses', authenticate, expenseController.createExpense);

    return router;
}