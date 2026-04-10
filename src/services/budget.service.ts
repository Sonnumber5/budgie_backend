import { CategoryDAO } from "../dao/category.dao";
import { BudgetDAO } from "../dao/budget.dao";
import { CategoryBudget, CategoryBudgetDTO, CategoryDTO, MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { AppError } from "../utils/AppError";
import { ExpenseDAO } from "../dao/expense.dao";

// Business logic layer for monthly budget and category budget operations.
export class BudgetService{
    constructor(private budgetDAO: BudgetDAO, private categoryDAO: CategoryDAO, private expenseDAO: ExpenseDAO){}

    // Creates a new monthly budget, throwing 409 if one already exists for that month.
    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const existingMonthlyBudget = await this.budgetDAO.findMonthlyBudgetByMonth(monthlyBudgetDTO.userId, monthlyBudgetDTO.month!);
        if (existingMonthlyBudget){
            throw new AppError('Monthly budget already exists', 409);
        }

        return await this.budgetDAO.createMonthlyBudget(monthlyBudgetDTO);
    }

    // Returns a monthly budget with its category budgets by the budget's ID.
    async getMonthlyBudgetWithCategoriesById(userId: number, id: number): Promise<MonthlyBudget>{
        const monthlyBudget = await this.budgetDAO.findMonthlyBudgetById(userId, id);
        if (!monthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        const categoryBudgets = await this.budgetDAO.findCategoryBudgetsByMonthlyBudgetId(userId, id);
        monthlyBudget.categoryBudgets = categoryBudgets;

        return monthlyBudget;
    }

    // Returns a monthly budget with its category budgets for a given month string.
    async getMonthlyBudgetWithCategoriesByMonth(userId: number, month: string): Promise<MonthlyBudget>{
        const monthlyBudget = await this.budgetDAO.findMonthlyBudgetByMonth(userId, month);
        if (!monthlyBudget){
            throw new AppError('Monthly budget not found', 404);
        }
        const categoryBudgets = await this.budgetDAO.findCategoryBudgetsByMonthlyBudgetId(userId, monthlyBudget.id);
        monthlyBudget.categoryBudgets = categoryBudgets;

        return monthlyBudget;
    }

    // Updates an existing monthly budget, throwing 404 if it doesn't exist.
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

    // Deletes a monthly budget by ID, throwing 404 if not found.
    async deleteMonthlyBudget(userId: number, id: number): Promise<void>{
        const result = await this.budgetDAO.deleteMonthlyBudget(userId, id);
        if (!result){
            throw new AppError('Budget not found', 404);
        }
    }

    // Returns a single category budget by ID, throwing 404 if not found.
    async getCategoryBudgetById(userId: number, id: number): Promise<CategoryBudget>{
        const result = await this.budgetDAO.findCategoryBudgetById(userId, id);
        if (!result){
            throw new AppError('Category budget not found', 404);
        }
        return result;
    }

    // Updates the budgeted amount for a category budget, throwing 404 if not found.
    async updateCategoryBudget(budgetedAmount: number, id: number, userId: number): Promise<CategoryBudget>{
        const result = await this.budgetDAO.updateCategoryBudget(budgetedAmount, id, userId);
        if (!result){
            throw new AppError('Category budget not found', 404);
        }
        return result;
    }

    // Deletes a category budget and its related expenses, throwing 404 if not found.
    async deleteCategoryBudget(userId: number, id: number): Promise<void>{
        const result = await this.budgetDAO.deleteCategoryBudget(userId, id);
        if (!result){
            throw new AppError('Category budget not found', 404);
        }
    }
}
