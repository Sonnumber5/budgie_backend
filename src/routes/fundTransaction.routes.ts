import { FundTransactionController } from "../controllers/fundTransaction.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

export const FundTransactionRoutes = (fundtransactionController: FundTransactionController) => {
    const router = Router();

    router.post('/savings-funds/:fundId/transactions', authenticate, fundtransactionController.createFundTransaction);
    router.get('/savings-funds/:fundId/transactions', authenticate, fundtransactionController.getFundTransaction);

    return router;
}