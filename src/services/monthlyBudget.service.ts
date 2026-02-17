import { CategoryDAO } from "../database_access/category.dao";
import { MonthlyBudgetDAO } from "../database_access/monthlyBudget.dao";
import { MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { AppError } from "../utils/AppError";

export class MonthlyBudgetService{
    constructor(private monthlyBudgetDAO: MonthlyBudgetDAO, private categoryDAO: CategoryDAO){}

    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const existingMonthlyBudget = await this.monthlyBudgetDAO.findMonthlyBudgetByMonth(monthlyBudgetDTO.userId, monthlyBudgetDTO.month);
        if (existingMonthlyBudget){
            throw new AppError('Monthly budget already exists', 409);
        }
        if (monthlyBudgetDTO.categoryBudgetDTOs.length > 0){
            for (const categoryBudget of monthlyBudgetDTO.categoryBudgetDTOs){
                const categoryExists = await this.categoryDAO.findCategoryById(categoryBudget.userId, categoryBudget.categoryId);
                if (!categoryExists){
                    throw new AppError('Category not found', 404);
                }
                if (categoryBudget.budgetedAmount <= 0){
                    throw new AppError('Budgeted amount must be a positive number', 400);
                }
            }
        }
        return await this.monthlyBudgetDAO.createMonthlyBudget(monthlyBudgetDTO);
    }
}