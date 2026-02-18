export const BudgetQueries = {
    CREATE_MONTHLY_BUDGET: `INSERT into monthly_budgets (user_id, month, expected_income) VALUES ($1, $2, $3)
    RETURNING id, month, expected_income AS "expectedIncome", created_at AS "createdAt", updated_at AS "updatedAt"`,

    FIND_MONTHLY_BUDGET_BY_MONTH: `SELECT id, month, expected_income AS "expectedIncome", created_at AS "createdAt", updated_at AS "updatedAt" 
    FROM monthly_budgets WHERE user_id = $1 AND month = $2`,

    FIND_MONTHLY_BUDGET_BY_ID: `SELECT id, month, expected_income AS "expectedIncome", created_at AS "createdAt", updated_at AS "updatedAt" 
    FROM monthly_budgets WHERE user_id = $1 AND id = $2`,





    CREATE_CATEGORY_BUDGET: `INSERT INTO category_budgets (monthly_budget_id, category_id, budgeted_amount) VALUES ($1, $2, $3)
                            RETURNING id, monthly_budget_id AS "monthlyBudgetId", category_id AS "categoryId", budgeted_amount AS "budgetedAmount", created_at AS "createdAt", updated_at AS "updatedAt"`,
    FIND_CATEGORY_BUDGETS_BY_MONTHLY_BUDGET_ID: `SELECT cb.id, cb.monthly_budget_id as "monthlyBudgetId", cb.category_id AS "categoryId", c.name as "categoryName", cb.budgeted_amount AS "budgetedAmount", cb.created_at AS "createdAt", cb.updated_at AS "updatedAt" 
                            FROM category_budgets cb
                            JOIN monthly_budgets mb on mb.id = cb.monthly_budget_id
                            JOIN categories c on c.id = cb.category_id
                            WHERE mb.user_id = $1 AND cb.monthly_budget_id = $2`,
    FIND_CATEGORY_BUDGETS_BY_MONTH: `SELECT cb.id, cb.monthly_budget_id as "monthlyBudgetId", cb.category_id AS "categoryId", c.name as "categoryName", cb.budgeted_amount AS "budgetedAmount", cb.created_at AS "createdAt", cb.updated_at AS "updatedAt" 
                            FROM category_budgets cb
                            JOIN monthly_budgets mb on mb.id = cb.monthly_budget_id
                            JOIN categories c on c.id = cb.category_id
                            WHERE mb.user_id = $1 AND mb.month = $2`

}