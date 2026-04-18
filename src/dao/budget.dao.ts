import pool from "../database";
import { CategoryBudgetDTO, MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { CategoryBudget } from "../types";
import { BudgetQueries } from "../queries/budget.queries";
import { ExpenseQueries } from "../queries/expense.queries";

// Data access layer for monthly budget and category budget database operations.
export class BudgetDAO{

    // Creates a monthly budget and all its category budgets in a single transaction.
    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const monthlyBudgetToCreate = await client.query<MonthlyBudget>(BudgetQueries.CREATE_MONTHLY_BUDGET, [monthlyBudgetDTO.userId, monthlyBudgetDTO.month, monthlyBudgetDTO.expectedIncome]);
            const id = monthlyBudgetToCreate.rows[0].id;
            const month = monthlyBudgetToCreate.rows[0].month;
            const expectedIncome = monthlyBudgetToCreate.rows[0].expectedIncome;
            const createdAt = monthlyBudgetToCreate.rows[0].createdAt;
            const updatedAt = monthlyBudgetToCreate.rows[0].updatedAt;

            const categoryBudgetsDTOs = monthlyBudgetDTO.categoryBudgetDTOs;
            for (let i = 0; i < categoryBudgetsDTOs.length; i++) {
                const current = categoryBudgetsDTOs[i];
                await client.query<CategoryBudget>(BudgetQueries.CREATE_CATEGORY_BUDGET, [id, current.categoryId, current.budgetedAmount]);
            }
            
            const allCategoryBudgets = await client.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGETS_BY_MONTHLY_BUDGET_ID, [monthlyBudgetDTO.userId, id]);
            const categoryBudgets = allCategoryBudgets.rows;

            const newMonthlyBudget: MonthlyBudget = {
                id,
                month,
                expectedIncome,
                categoryBudgets,
                createdAt,
                updatedAt,
            }

            await client.query('COMMIT');
            return newMonthlyBudget;

        }catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to create monthly budget', error);
            throw error;
        }finally{
            client.release();
        }
    }

    // Returns a monthly budget for the given month, or null if not found.
    async findMonthlyBudgetByMonth(userId: number, month: string): Promise<MonthlyBudget | null>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.FIND_MONTHLY_BUDGET_BY_MONTH, [userId, month]);
        return result.rows[0] ?? null;
    }

    // Returns a monthly budget by its ID, or null if not found.
    async findMonthlyBudgetById(userId: number, id: number): Promise<MonthlyBudget | null>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.FIND_MONTHLY_BUDGET_BY_ID, [userId, id]);
        return result.rows[0] ?? null;
    }

    // Updates a monthly budget and its category budgets in a single transaction.
    async updateMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const result = await client.query<MonthlyBudget>(BudgetQueries.UPDATE_MONTHLY_BUDGET, [monthlyBudgetDTO.expectedIncome, monthlyBudgetDTO.id, monthlyBudgetDTO.userId]);

            if (result.rows.length === 0){
                throw new Error('Monthly budget not found or unauthorized');
            }

            const updatedMonthlyBudget = result.rows[0];

            for (const current of monthlyBudgetDTO.categoryBudgetDTOs) {
                if (current.id){
                    const updated = await client.query<CategoryBudget>(BudgetQueries.UPDATE_CATEGORY_BUDGET, [current.budgetedAmount, current.id, monthlyBudgetDTO.userId]);
                } else{
                    const newCategoryBudget = await client.query<CategoryBudget>(BudgetQueries.CREATE_CATEGORY_BUDGET, [monthlyBudgetDTO.id, current.categoryId, current.budgetedAmount]);
                }
            }

            const allCategoryBudgets = await client.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGETS_BY_MONTHLY_BUDGET_ID, [monthlyBudgetDTO.userId, monthlyBudgetDTO.id]);
            updatedMonthlyBudget.categoryBudgets = allCategoryBudgets.rows;

            await client.query('COMMIT');
            return updatedMonthlyBudget;

        }catch(error){
            await client.query('ROLLBACK');
            console.error('Failed to update monthly budget', error);
            throw error;
        }finally{
            client.release();
        }
    }

    // Deletes a monthly budget row and returns true if a row was removed.
    async deleteMonthlyBudget(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.DELETE_MONTHLY_BUDGET, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    // Returns all category budgets belonging to a monthly budget.
    async findCategoryBudgetsByMonthlyBudgetId(userId: number, id: number): Promise<CategoryBudget[]>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGETS_BY_MONTHLY_BUDGET_ID, [userId, id]);
        return result.rows;
    }

    // Returns a single category budget row by its ID.
    async findCategoryBudgetById(userId: number, id: number): Promise<CategoryBudget>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGET_BY_ID, [userId, id]);
        return result.rows[0];
    }

    // Updates the budgeted amount for a category budget and returns the updated record.
    async updateCategoryBudget(budgetedAmount: number, id: number, userId: number): Promise<CategoryBudget>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.UPDATE_CATEGORY_BUDGET, [budgetedAmount, id, userId]);
        return result.rows[0];
    }

    // Deletes a category budget and its related expenses in a single transaction.
    async deleteCategoryBudget(userId: number, id: number): Promise<boolean>{
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Get the category budget details
            const categoryBudgetResult = await client.query(
                BudgetQueries.GET_CATEGORY_BUDGET_DETAILS,
                [id, userId]
            );

            if (categoryBudgetResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return false;
            }

            const { categoryId, month } = categoryBudgetResult.rows[0];

            //Delete related expenses
            await client.query(
                ExpenseQueries.DELETE_EXPENSES_BY_CATEGORY_AND_MONTH,
                [userId, categoryId, month]
            );

            // Delete the category budget
            const result = await client.query(
                BudgetQueries.DELETE_CATEGORY_BUDGET,
                [userId, id]
            );

            await client.query('COMMIT');
            return result.rowCount !== null && result.rowCount > 0;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Failed to delete category budget:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}
