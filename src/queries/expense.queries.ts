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
                              updated_at AS "updatedAt"`,
    FIND_EXPENSES_BY_DATE: `SELECT e.id, e.category_id AS "categoryId", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", e.created_at AS "createdAt", e.updated_at AS "updatedAt"
                    FROM expenses e
                    JOIN categories c ON c.id = e.category_id
                    WHERE e.user_id = $1 AND e.month = $2`,
    FIND_ALL_EXPENSES: `SELECT id, category_id AS "categoryId", vendor, amount, description, expense_date AS "expenseDate", created_at AS "createdAt", updated_at AS "updatedAt" 
                        FROM expenses
                        WHERE user_id = $1`
}