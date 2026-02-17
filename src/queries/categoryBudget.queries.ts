export const CategoryBudgetQueries = {
    CREATE_CATEGORY_BUDGET: `INSERT INTO category_budgets (monthly_budget_id, category_id, budgeted_amount) VALUES ($1, $2, $3)
                             RETURNING id, monthly_budget_id AS "monthlyBudgetId", category_id AS "categoryId", budgeted_amount AS "budgetedAmount", created_at AS "createdAt", updated_at AS "updatedAt"`,
}