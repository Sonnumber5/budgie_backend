import { AccountBalanceController } from "../controllers/accountBalance.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

export const accountBalanceRoutes = (accountBalanceController: AccountBalanceController) => {
    const router = Router();

    router.post('/account-balances', authenticate, accountBalanceController.createAccountBalance);
    router.get('/account-balances', authenticate, accountBalanceController.getAccountBalances);
    router.put('/account-balances', authenticate, accountBalanceController.resetAccountBalance);
    router.get('/account-balances/:id', authenticate, accountBalanceController.getAccountBalanceById);
    router.put('/account-balances/:id', authenticate, accountBalanceController.updateAccountBalance);
    router.delete('/account-balances/:id', authenticate, accountBalanceController.deleteAccountBalance);

    return router;
}