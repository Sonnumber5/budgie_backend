import { Router } from "express"
import { SavingsFundController } from "../controllers/savingsFund.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const SavingsFundRoutes = (savingsFundController: SavingsFundController) => {
    const router = Router()

    router.post('/savings-funds', authenticate, savingsFundController.createSavingsFund);
    router.get('/savings-funds', authenticate, savingsFundController.getSavingsFunds);
    router.get('/savings-funds/:id', authenticate, savingsFundController.getSavingsFundById);
    router.put('/savings-funds/:id', authenticate, savingsFundController.updateSavingsFund);
    router.delete('/savings-funds/:id', authenticate, savingsFundController.deleteSavingsFund);
    
    return router;
}