export const ExpenseQueries = {
    CREATE_EXPENSE: `INSERT INTO expenses (user_id, category_id, vendor, amount, description, expense_date, month) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id, 
                              category_id AS "categoryId", 
                              vendor, 
                              amount, 
                              description, 
                              expense_date AS "expenseDate", 
                              created_at AS "createdAt", 
                              updated_at AS "updatedAt"`
}