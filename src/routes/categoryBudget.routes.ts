import { Router } from "express"
import { CategoryBudgetController } from "../controllers/categoryBudget.controller";

export const CategoryBudgetRoutes = (categoryBudgetController: CategoryBudgetController) => {
    const router = Router();

    return router;
}