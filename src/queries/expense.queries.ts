export const ExpenseQueries = {
CREATE_EXPENSE: `INSERT INTO expenses (user_id, category_id, vendor, amount, description, expense_date, month) VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id`,
GET_CREATED_EXPENSE: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", 
e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", 
e.month, e.created_at AS "createdAt", e.updated_at AS "updatedAt"
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = $1 AND e.id = $2`,
FIND_EXPENSES_BY_DATE: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", e.month, e.created_at AS "createdAt", e.updated_at AS "updatedAt"
FROM expenses e
JOIN categories c ON c.id = e.category_id
WHERE e.user_id = $1 AND e.month = $2
ORDER BY e.expense_date DESC`,
FIND_ALL_EXPENSES: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", month, e.created_at AS "createdAt", e.updated_at AS "updatedAt"
FROM expenses e
JOIN categories c ON c.id = e.category_id
WHERE e.user_id = $1
ORDER BY e.expense_date DESC`,
FIND_EXPENSE_BY_ID: `SELECT e.id, e.category_id AS "categoryId", c.name AS "categoryName", e.vendor, e.amount, e.description, e.expense_date AS "expenseDate", month, e.created_at AS "createdAt", e.updated_at AS "updatedAt"
FROM expenses e
JOIN categories c ON c.id = e.category_id
WHERE e.user_id = $1 AND e.id = $2`,
FIND_EXPENSE_SUM_FOR_MONTH: `SELECT SUM(amount) as "expense_sum" from expenses WHERE user_id = $1 AND month = $2`,
UPDATE_EXPENSE: `UPDATE expenses SET category_id = $1, vendor = $2, amount = $3, description = $4, expense_date = $5, month = $6
WHERE id = $7 AND user_id = $8
RETURNING id, category_id AS "categoryId", vendor, amount, description, expense_date AS "expenseDate", month, created_at AS "createdAt", updated_at AS "updatedAt"`,     
DELETE_EXPENSE: `DELETE FROM expenses WHERE user_id = $1 AND id = $2`,
DELETE_EXPENSES_BY_CATEGORY_AND_MONTH: `DELETE FROM expenses 
WHERE category_id = $1 
AND user_id = $2 
AND DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', $3::date)`,           
}