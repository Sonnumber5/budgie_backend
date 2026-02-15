export const AuthQueries = {
    CREATE_USER: `INSERT INTO users (email, password_hash, name) 
                  VALUES ($1, $2, $3) 
                  RETURNING id, email, 
                            password_hash AS "passwordHash", 
                            name, 
                            created_at AS "createdAt", 
                            updated_at AS "updatedAt"`,
    
    FIND_USER_BY_ID: `SELECT id, email, 
                             password_hash AS "passwordHash", 
                             name, 
                             created_at AS "createdAt", 
                             updated_at AS "updatedAt" 
                      FROM users 
                      WHERE id = $1`,

    FIND_USER_BY_EMAIL: `SELECT id, email, 
                                password_hash AS "passwordHash", 
                                name, 
                                created_at AS "createdAt", 
                                updated_at AS "updatedAt" 
                         FROM users 
                         WHERE email = $1`
}