export const IncomeQueries = {
    CREATE_INCOME: `INSERT INTO income (user_id, amount, source, description, income_date, month) VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id, amount, source, description, income_date, month`
}