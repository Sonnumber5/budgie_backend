import { CategoryDAO } from "../database_access/category.dao";
import { BudgetDAO } from "../database_access/budget.dao";
import { CategoryBudget, CategoryBudgetDTO, CategoryDTO, MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { AppError } from "../utils/AppError";

export class BudgetService{
    constructor(private budgetDAO: BudgetDAO, private categoryDAO: CategoryDAO){}

    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const existingMonthlyBudget = await this.budgetDAO.findMonthlyBudgetByMonth(monthlyBudgetDTO.userId, monthlyBudgetDTO.month!);
        if (existingMonthlyBudget){
            throw new AppError('Monthly budget already exists', 409);
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

    async updateMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        if (!monthlyBudgetDTO.id){
            throw new AppError('Monthly budget id is required for update', 400);
        }
        
        const existingMonthlyBudget = await this.budgetDAO.findMonthlyBudgetById(monthlyBudgetDTO.userId, monthlyBudgetDTO.id);

        if (!existingMonthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        return await this.budgetDAO.updateMonthlyBudget(monthlyBudgetDTO);
    }

    async deleteMonthlyBudget(userId: number, id: number): Promise<void>{
        const result = await this.budgetDAO.deleteMonthlyBudget(userId, id);
        if (!result){
            throw new AppError('Budget not found', 404);
        }
    }

    async updateCategoryBudget(budgetedAmount: number, id: number, userId: number): Promise<CategoryBudget>{
        return await this.budgetDAO.updateCategoryBudget(budgetedAmount, id, userId);
    }

    async deleteCategoryBudget(userId: number, id: number): Promise<void>{
        const result = await this.budgetDAO.deleteCategoryBudget(userId, id);
        if (!result){
            throw new AppError('Category budget not found', 404);
        }
    }
}