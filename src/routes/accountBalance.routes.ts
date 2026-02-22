import { AccountBalanceController } from "../controllers/accountBalance.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.authenticate";

export const AccountBalanceRoutes = (accountBalanceController: AccountBalanceController) => {
    const router = Router();

    router.post('/account-balances', authenticate, accountBalanceController.createAccountBalance);

    return router;
}