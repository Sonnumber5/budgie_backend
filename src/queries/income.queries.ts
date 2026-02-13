export const IncomeQueries = {
    CREATE_INCOME: `INSERT INTO income (user_id, amount, source, description, income_date, month) VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id, amount, source, description, income_date, month`,
    FIND_INCOME_BY_MONTH: `SELECT id, amount, source, description, income_date, created_at, updated_at from income WHERE user_id = $1 AND month = $2`,
    FIND_ALL_INCOME: `SELECT id, amount, source, description, income_date, created_at, updated_at from income WHERE user_id = $1`,
    FIND_INCOME_BY_ID: `SELECT id, amount, source, description, income_date, created_at, updated_at from income WHERE user_id = $1 AND id = $2`
}