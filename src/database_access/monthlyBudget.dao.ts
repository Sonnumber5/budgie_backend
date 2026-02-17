import pool from "../database";
import { MonthlyBudget, MonthlyBudgetDTO } from "../types";
import { CategoryBudgetDAO } from "./categoryBudget.dao";
import { CategoryBudget } from "../types";
import { CategoryBudgetQueries } from "../queries/categoryBudget.queries";
import { MontlyBudgetQueries } from "../queries/monthlyBudget.queries";

export class MonthlyBudgetDAO{
    
    async createMonthlyBudget(monthlyBudgetDTO: MonthlyBudgetDTO): Promise<MonthlyBudget>{
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const monthlyBudgetToCreate = await client.query<MonthlyBudget>(MontlyBudgetQueries.CREATE_MONTHLY_BUDGET, [monthlyBudgetDTO.userId, monthlyBudgetDTO.month, monthlyBudgetDTO.expectedIncome]);
            const id = monthlyBudgetToCreate.rows[0].id;
            const month = monthlyBudgetToCreate.rows[0].month;
            const expectedIncome = monthlyBudgetToCreate.rows[0].expectedIncome;
            let categoryBudgets: CategoryBudget[] = [];
            const createdAt = monthlyBudgetToCreate.rows[0].createdAt;
            const updatedAt = monthlyBudgetToCreate.rows[0].updatedAt;

            const categoryBudgetsDTOs = monthlyBudgetDTO.categoryBudgetDTOs;
            if (categoryBudgetsDTOs.length > 0){
                for (let i = 0; i < categoryBudgetsDTOs.length; i++) {
                    const current = categoryBudgetsDTOs[i];
                    const newCategoryBudget = await client.query<CategoryBudget>(CategoryBudgetQueries.CREATE_CATEGORY_BUDGET, [id, current.categoryId, current.budgetedAmount]);
                    categoryBudgets.push(newCategoryBudget.rows[0])
                }
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
        const result = await pool.query<MonthlyBudget>(MontlyBudgetQueries.FIND_MONTHLY_BUDGET, [userId, month]);
        return result.rows[0] ?? null;
    }
}