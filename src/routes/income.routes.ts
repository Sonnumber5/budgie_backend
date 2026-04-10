import { IncomeController } from "../controllers/income.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

// Registers income CRUD and totals routes on a new Express router and returns it.
export const incomeRoutes = (incomeController: IncomeController) => {
    const router = Router();
    
    router.get('/income/total', authenticate, incomeController.getMonthlyIncomeSum);
    router.post('/income', authenticate, incomeController.createIncome);
    router.get('/income', authenticate, incomeController.getIncome);
    router.get('/income/:id', authenticate, incomeController.getIncomeById);
    router.put('/income/:id', authenticate, incomeController.updateIncome);
    router.delete('/income/:id', authenticate, incomeController.deleteIncome);


    return router;
}