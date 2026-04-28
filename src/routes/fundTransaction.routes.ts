import { FundTransactionController } from "../controllers/fundTransaction.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

// Registers savings fund transaction routes (CRUD, transfer, adjustment) on a new Express router and returns it.
export const fundTransactionRoutes = (fundTransactionController: FundTransactionController) => {
    const router = Router();
    
    router.get('/savings-funds/contributions', authenticate, fundTransactionController.getContributionSumForMonth);
    router.post('/savings-funds/:fundId/transactions', authenticate, fundTransactionController.createFundTransaction);
    router.get('/savings-funds/:fundId/transactions', authenticate, fundTransactionController.getFundTransactions);
    router.get('/savings-funds/transactions', authenticate, fundTransactionController.getTransactionsForActiveFunds);
    router.get('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundTransactionController.getFundTransactionById);
    router.put('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundTransactionController.updateFundTransaction);
    router.delete('/savings-funds/:fundId/transactions/:transactionId', authenticate, fundTransactionController.deleteFundTransaction);
    router.post('/savings-funds/:fundId/transactions/transfer', authenticate, fundTransactionController.transferBalance);
    router.post('/savings-funds/:fundId/transactions/adjustment', authenticate, fundTransactionController.adjustBalance);

    return router;
}