export const CategoryQueries = {
    CREATE_CATEGORY: `INSERT INTO categories (user_id, name) VALUES ($1, $2)
                      RETURNING id, name, created_at`,
    FIND_CATEGORY_BY_NAME: `SELECT id, name FROM categories WHERE user_id = $1 AND name = $2`,

    FIND_CATEGORY_BY_ID: `SELECT * FROM categories WHERE user_id = $1 AND id = $2`,

    FIND_CATEGORIES: `SELECT * FROM categories WHERE user_id = $1`,
}