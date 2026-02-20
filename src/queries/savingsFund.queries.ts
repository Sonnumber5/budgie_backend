export const SavingsFundQueries = {
    CREATE_SAVINGS_FUND: 
    `INSERT into savings_funds (user_id, name, goal, balance, archived_at) 
    VALUES ($1, $2, $3, 0.00, NULL)
    RETURNING id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"`,
    FIND_ACTIVE_SAVINGS_FUND_BY_NAME:
    `SELECT id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM savings_funds
    WHERE user_id = $1 AND name = $2 AND archived_at IS NULL`,
    FIND_SAVINGS_FUND_BY_ID: 
    `SELECT id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM savings_funds
    WHERE user_id = $1 AND id = $2`
}