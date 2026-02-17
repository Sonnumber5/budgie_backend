export const MontlyBudgetQueries = {
    CREATE_MONTHLY_BUDGET: `INSERT into monthly_budgets (user_id, month, expected_income) VALUES ($1, $2, $3)
                            RETURNING id, month, expected_income AS "expectedIncome"`,
    
}