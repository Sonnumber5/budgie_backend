export const AuthQueries = {
    CREATE_USER: `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, created_at, updated_at`,
    
    FIND_USER_BY_ID: `SELECT * FROM users WHERE id = $1`,

    FIND_USER_BY_EMAIL: `SELECT * FROM users WHERE email = $1`,

}