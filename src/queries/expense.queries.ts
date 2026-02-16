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
    FIND_EXPENSES_BY_DATE: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", e.created_at AS "createdAt", e.updated_at AS "updatedAt"
                    FROM expenses e
                    JOIN categories c ON c.id = e.category_id
                    WHERE e.user_id = $1 AND e.month = $2
                    ORDER BY e.expense_date DESC`,
    FIND_ALL_EXPENSES: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", e.created_at AS "createdAt", e.updated_at AS "updatedAt"
                    FROM expenses e
                    JOIN categories c ON c.id = e.category_id
                    WHERE e.user_id = $1
                    ORDER BY e.expense_date DESC`,
    FIND_EXPENSE_BY_ID: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", e.created_at AS "createdAt", e.updated_at AS "updatedAt"
                    FROM expenses e
                    JOIN categories c ON c.id = e.category_id
                    WHERE e.user_id = $1 AND e.id = $2`,
    UPDATE_EXPENSE: `UPDATE expenses SET category_id = $1, vendor = $2, amount = $3, description = $4, expense_date = $5, month = $6
                    WHERE id = $7 AND user_id = $8
                    RETURNING id, 
                                category_id AS "categoryId", 
                                vendor, 
                                amount, 
                                description, 
                                expense_date AS "expenseDate", 
                                created_at AS "createdAt", 
                                updated_at AS "updatedAt"`,     
    DELETE_EXPENSE: `DELETE FROM expenses WHERE user_id = $1 AND id = $2`           
}