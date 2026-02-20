import { Router } from "express"
import { SavingsFundController } from "../controllers/savingsFund.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const SavingsFundRoutes = (savingsFundController: SavingsFundController) => {
    const router = Router()

    router.post('/savings-funds', authenticate, savingsFundController.createSavingsFund);
    router.get('/savings-funds/:id', authenticate, savingsFundController.getSavingsFundById);
    router.get('/savings-funds', authenticate, savingsFundController.getSavingsFunds);
    
    return router;
}