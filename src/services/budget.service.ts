import { CategoryDAO } from "../database_access/category.dao";
import { BudgetDAO } from "../database_access/budget.dao";
import { MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { AppError } from "../utils/AppError";

export class BudgetService{
    constructor(private budgetDAO: BudgetDAO, private categoryDAO: CategoryDAO){}

    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const existingMonthlyBudget = await this.budgetDAO.findMonthlyBudgetByMonth(monthlyBudgetDTO.userId, monthlyBudgetDTO.month);
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
        return await this.budgetDAO.createMonthlyBudget(monthlyBudgetDTO);
    }

    async getMonthlyBudgetWithCategoriesById(userId: number, id: number): Promise<MonthlyBudget>{
        const monthlyBudget = await this.budgetDAO.findMonthlyBudgetById(userId, id);
        if (!monthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        const categoryBudgets = await this.budgetDAO.findCategoryBudgetsByMonthlyBudgetId(userId, id);
        monthlyBudget.categoryBudgets = categoryBudgets;

        return monthlyBudget;
    }

    async getMonthlyBudgetWithCategoriesByMonth(userId: number, month: string): Promise<MonthlyBudget>{
        const monthlyBudget = await this.budgetDAO.findMonthlyBudgetByMonth(userId, month);
        if (!monthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        const categoryBudgets = await this.budgetDAO.findCategoryBudgetsByMonthlyBudgetId(userId, monthlyBudget.id);
        monthlyBudget.categoryBudgets = categoryBudgets;

        return monthlyBudget;
    }
}