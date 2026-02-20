import { Router } from "express"
import { SavingsFundController } from "../controllers/savingsFund.controller";

export const SavingsFundRoutes = (savingsFundController: SavingsFundController) => {
    const router = Router()

    return router;
}