export const IncomeQueries = {
    CREATE_INCOME: `INSERT INTO income (user_id, amount, source, description, income_date, month) 
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id, amount, source, description, 
                              income_date AS "incomeDate", 
                              created_at AS "createdAt", 
                              updated_at AS "updatedAt"`,
    FIND_INCOME_BY_MONTH: `SELECT id, amount, source, description, 
                                  income_date AS "incomeDate", 
                                  created_at AS "createdAt", 
                                  updated_at AS "updatedAt" 
                           FROM income 
                           WHERE user_id = $1 AND month = $2`,
    FIND_ALL_INCOME: `SELECT id, amount, source, description, 
                             income_date AS "incomeDate", 
                             created_at AS "createdAt", 
                             updated_at AS "updatedAt" 
                      FROM income 
                      WHERE user_id = $1`,
    FIND_INCOME_BY_ID: `SELECT id, amount, source, description, 
                               income_date AS "incomeDate", 
                               created_at AS "createdAt", 
                               updated_at AS "updatedAt" 
                        FROM income 
                        WHERE user_id = $1 AND id = $2`,
    UPDATE_INCOME: `UPDATE income 
                    SET amount = $1, source = $2, description = $3, income_date = $4, month = $5 
                    WHERE id = $6 AND user_id = $7
                    RETURNING id, amount, source, description, 
                              income_date AS "incomeDate", 
                              created_at AS "createdAt", 
                              updated_at AS "updatedAt"`,
    DELETE_INCOME: `DELETE FROM income WHERE id = $1 AND user_id = $2`
}