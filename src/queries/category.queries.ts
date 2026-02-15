export const CategoryQueries = {
    CREATE_CATEGORY: `INSERT INTO categories (user_id, name) 
                      VALUES ($1, $2)
                      RETURNING id, name, created_at AS "createdAt"`,
    
    FIND_CATEGORY_BY_NAME: `SELECT id, name, created_at AS "createdAt" 
                            FROM categories 
                            WHERE user_id = $1 AND name = $2`,

    FIND_CATEGORY_BY_ID: `SELECT id, name, created_at AS "createdAt" 
                          FROM categories 
                          WHERE user_id = $1 AND id = $2`,

    FIND_CATEGORIES: `SELECT id, name, created_at AS "createdAt" 
                      FROM categories 
                      WHERE user_id = $1`,

    UPDATE_CATEGORY: `UPDATE categories 
                      SET name = $1 
                      WHERE id = $2 AND user_id = $3
                      RETURNING id, name, created_at AS "createdAt"`,

    DELETE_CATEGORY: `DELETE FROM categories 
                      WHERE id = $1 AND user_id = $2`
}