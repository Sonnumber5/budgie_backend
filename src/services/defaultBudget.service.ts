import { DefaultBudgetDAO } from "../dao/defaultBudget.dao";
import { DefaultBudget, DefaultBudgetDTO } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for default budget and default category budget operations.
export class DefaultBudgetService{
    constructor(private defaultBudgetDAO: DefaultBudgetDAO){}

    // Saves over a new default budget.
    async saveDefaultBudget(defaultBudgetDTO: DefaultBudgetDTO): Promise<DefaultBudget>{
        return await this.defaultBudgetDAO.saveDefaultBudget(defaultBudgetDTO);
    }

    // Returns the default budget with its default category budgets by the budget's ID.
    async getDefaultBudgetByUserId(userId: number): Promise<DefaultBudget>{
        const monthlyBudget = await this.defaultBudgetDAO.findDefaultBudgetByUserId(userId);
        if (!monthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        return monthlyBudget;
    }
}
