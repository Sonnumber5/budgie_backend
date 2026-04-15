import pool from "../database";
import { DefaultCategoryBudget, DefaultBudget, DefaultBudgetDTO } from "../types";
import { DefaultBudgetQueries } from "../queries/defaultBudget.queries";

// Data access layer for default monthly budget and default category budget database operations.
export class DefaultBudgetDAO {

    // Deletes any existing default budget (cascade removes category budgets),
    // then creates a new default budget and all its category budgets in a single transaction.
    async saveDefaultBudget(defaultBudgetDTO: DefaultBudgetDTO): Promise<DefaultBudget> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Delete existing default budget if one exists — cascade handles category budgets
            await client.query(DefaultBudgetQueries.DELETE_DEFAULT_BUDGET, [defaultBudgetDTO.userId]);

            // Create new default budget
            const result = await client.query<DefaultBudget>(DefaultBudgetQueries.CREATE_DEFAULT_BUDGET, [defaultBudgetDTO.userId, defaultBudgetDTO.expectedIncome]);
            const { id, expectedIncome, createdAt, updatedAt } = result.rows[0];

            // Create new default category budgets
            const defaultCategoryBudgets: DefaultCategoryBudget[] = [];
            for (const current of defaultBudgetDTO.defaultCategoryBudgetDTOs) {
                const newCategoryBudget = await client.query<DefaultCategoryBudget>(DefaultBudgetQueries.CREATE_DEFAULT_CATEGORY_BUDGET, [id, current.categoryId, current.budgetedAmount]);
                defaultCategoryBudgets.push(newCategoryBudget.rows[0]);
            }

            const newDefaultBudget: DefaultBudget = {
                id,
                expectedIncome,
                defaultCategoryBudgets,
                createdAt,
                updatedAt,
            };

            await client.query('COMMIT');
            return newDefaultBudget;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Failed to save default budget', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Returns the default budget belonging to the userId with its category budgets, or null if not found.
    async findDefaultBudgetByUserId(userId: number): Promise<DefaultBudget | null> {
        const budgetResult = await pool.query<DefaultBudget>(DefaultBudgetQueries.FIND_DEFAULT_BUDGET_BY_USER_ID, [userId]);
        
        if (budgetResult.rows.length === 0) return null;

        const budget = budgetResult.rows[0];
        const categoryBudgets = await pool.query<DefaultCategoryBudget>(DefaultBudgetQueries.FIND_DEFAULT_CATEGORY_BUDGETS_BY_DEFAULT_BUDGET_ID, [budget.id]);
        budget.defaultCategoryBudgets = categoryBudgets.rows;

        return budget;
    }
}