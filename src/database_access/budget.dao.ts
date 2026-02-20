import pool from "../database";
import { CategoryBudgetDTO, MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { CategoryBudget } from "../types";
import { BudgetQueries } from "../queries/budget.queries";

export class BudgetDAO{
    
    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const monthlyBudgetToCreate = await client.query<MonthlyBudget>(BudgetQueries.CREATE_MONTHLY_BUDGET, [monthlyBudgetDTO.userId, monthlyBudgetDTO.month, monthlyBudgetDTO.expectedIncome]);
            const id = monthlyBudgetToCreate.rows[0].id;
            const month = monthlyBudgetToCreate.rows[0].month;
            const expectedIncome = monthlyBudgetToCreate.rows[0].expectedIncome;
            let categoryBudgets: CategoryBudget[] = [];
            const createdAt = monthlyBudgetToCreate.rows[0].createdAt;
            const updatedAt = monthlyBudgetToCreate.rows[0].updatedAt;

            const categoryBudgetsDTOs = monthlyBudgetDTO.categoryBudgetDTOs;
            for (let i = 0; i < categoryBudgetsDTOs.length; i++) {
                const current = categoryBudgetsDTOs[i];
                const newCategoryBudget = await client.query<CategoryBudget>(BudgetQueries.CREATE_CATEGORY_BUDGET, [id, current.categoryId, current.budgetedAmount]);
                categoryBudgets.push(newCategoryBudget.rows[0])
            }
            

            const newMonthlyBudget: MonthlyBudget = {
                id,
                month,
                expectedIncome,
                categoryBudgets,
                createdAt,
                updatedAt
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

    async findMonthlyBudgetByMonth(userId: number, month: string): Promise<MonthlyBudget | null>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.FIND_MONTHLY_BUDGET_BY_MONTH, [userId, month]);
        return result.rows[0] ?? null;
    }

    async findMonthlyBudgetById(userId: number, id: number): Promise<MonthlyBudget | null>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.FIND_MONTHLY_BUDGET_BY_ID, [userId, id]);
        return result.rows[0] ?? null;
    }

    async updateMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const result = await client.query<MonthlyBudget>(BudgetQueries.UPDATE_MONTHLY_BUDGET, [monthlyBudgetDTO.expectedIncome, monthlyBudgetDTO.id, monthlyBudgetDTO.userId]);
            
            if (result.rows.length === 0){
                throw new Error('Monthly budget not found or unauthorized');
            }
            
            const updatedMonthlyBudget = result.rows[0];

            let updatedCategoryBudgets: CategoryBudget[] = [];
            for (const current of monthlyBudgetDTO.categoryBudgetDTOs) {
                if (current.id){
                    const updated = await client.query<CategoryBudget>(BudgetQueries.UPDATE_CATEGORY_BUDGET, [current.budgetedAmount, current.id, monthlyBudgetDTO.userId]);
                    if (updated.rows.length === 0) {
                        throw new Error('Category budget not found or unauthorized');
                    }
                    updatedCategoryBudgets.push(updated.rows[0]);
                } else{
                    const newCategoryBudget = await client.query<CategoryBudget>(BudgetQueries.CREATE_CATEGORY_BUDGET, [monthlyBudgetDTO.id, current.categoryId, current.budgetedAmount]);
                    updatedCategoryBudgets.push(newCategoryBudget.rows[0]);
                }
            }

            updatedMonthlyBudget.categoryBudgets = updatedCategoryBudgets;

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

    async deleteMonthlyBudget(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<MonthlyBudget>(BudgetQueries.DELETE_MONTHLY_BUDGET, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    async findCategoryBudgetsByMonthlyBudgetId(userId: number, id: number): Promise<CategoryBudget[]>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGETS_BY_MONTHLY_BUDGET_ID, [userId, id]);
        return result.rows;
    }

    async findCategoryBudgetById(userId: number, id: number): Promise<CategoryBudget>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.FIND_CATEGORY_BUDGET_BY_ID, [userId, id]);
        return result.rows[0];
    }

    async updateCategoryBudget(budgetedAmount: number, id: number, userId: number): Promise<CategoryBudget>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.UPDATE_CATEGORY_BUDGET, [budgetedAmount, id, userId]);
        return result.rows[0];
    }

    async deleteCategoryBudget(userId: number, id: number): Promise<boolean>{
        const result = await pool.query<CategoryBudget>(BudgetQueries.DELETE_CATEGORY_BUDGET, [userId, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}