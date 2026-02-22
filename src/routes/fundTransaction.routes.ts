import { FundTransactionController } from "../controllers/fundTransaction.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

export const FundTransactionRoutes = (fundtransactionController: FundTransactionController) => {
    const router = Router();

    router.post('/savings-funds/:fundId/transactions', authenticate, fundtransactionController.createFundTransaction);
    router.get('/savings-funds/:fundId/transactions', authenticate, fundtransactionController.getFundTransactions);
    router.get('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundtransactionController.getFundTransactionById);
    router.put('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundtransactionController.updateFundTransaction);
    router.delete('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundtransactionController.deleteFundTransaction);
    router.post('/savings-funds/:fundId/transactions/transfer', authenticate, fundtransactionController.transferBalance);

    return router;
}