import { Router } from "express"
import { SavingsFundController } from "../controllers/savingsFund.controller";
import { authenticate } from "../middleware/auth.authenticate";

export const SavingsFundRoutes = (savingsFundController: SavingsFundController) => {
    const router = Router()

    router.post('/savings-funds', authenticate, savingsFundController.createSavingsFund);
    return router;
}