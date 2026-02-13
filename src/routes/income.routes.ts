import { IncomeController } from "../controllers/income.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

export const IncomeRoutes = (incomeController: IncomeController) => {
    const router = Router();

    router.post('/income', authenticate, incomeController.createIncome);
    router.get('/income', authenticate, incomeController.getIncome);

    return router;
}