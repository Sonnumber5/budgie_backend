export const DefaultBudgetQueries = {
    /*--------- Default Monthly Budgets ---------*/
    CREATE_DEFAULT_BUDGET: `INSERT INTO default_budgets (user_id, expected_income) 
    VALUES ($1, $2)
    RETURNING id, expected_income AS "expectedIncome", created_at AS "createdAt", updated_at AS "updatedAt"`,

    FIND_DEFAULT_BUDGET_BY_USER_ID: `SELECT id, expected_income AS "expectedIncome", created_at AS "createdAt", updated_at AS "updatedAt" 
    FROM default_budgets 
    WHERE user_id = $1
    LIMIT 1`,

    DELETE_DEFAULT_BUDGET: `DELETE FROM default_budgets 
    WHERE user_id = $1`,

    /*--------- Default Category Budgets ---------*/
    CREATE_DEFAULT_CATEGORY_BUDGET: `INSERT INTO default_category_budgets (default_budget_id, category_id, budgeted_amount) 
    VALUES ($1, $2, $3)
    RETURNING id, default_budget_id AS "defaultBudgetId", category_id AS "categoryId", budgeted_amount AS "budgetedAmount", created_at AS "createdAt", updated_at AS "updatedAt"`,

    FIND_DEFAULT_CATEGORY_BUDGETS_BY_DEFAULT_BUDGET_ID: `SELECT dcb.id, dcb.default_budget_id AS "defaultBudgetId", dcb.category_id AS "categoryId", c.name AS "categoryName", dcb.budgeted_amount AS "budgetedAmount", dcb.created_at AS "createdAt", dcb.updated_at AS "updatedAt" 
    FROM default_category_budgets dcb
    JOIN categories c ON c.id = dcb.category_id
    WHERE dcb.default_budget_id = $1
    ORDER BY c.name ASC`,
}