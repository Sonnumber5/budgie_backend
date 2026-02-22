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
    WHERE user_id = $1 AND id = $2`,
    FIND_ACTIVE_SAVINGS_FUNDS:
    `SELECT id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM savings_funds
    WHERE user_id = $1 AND archived_at IS NULL`,
    FIND_ARCHIVED_SAVINGS_FUNDS:
    `SELECT id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM savings_funds
    WHERE user_id = $1 AND archived_at IS NOT NULL`,
    UPDATE_SAVINGS_FUND:
    `UPDATE savings_funds SET name = $1, goal = $2 WHERE user_id = $3 AND id = $4
    RETURNING id, name, goal, balance, archived_at AS "archivedAt", created_at AS "createdAt", updated_at AS "updatedAt"`,
    UPDATE_SAVINGS_FUND_BALANCE: `UPDATE savings_funds SET balance = balance + $1
    WHERE user_id = $2 AND id = $3`,
    SET_SAVINGS_FUND_BALANCE: `UPDATE savings_funds SET balance = $1
    WHERE user_id = $2 AND id = $3`,
    ARCHIVE_FUND:
    `UPDATE savings_funds SET archived_at = $1 WHERE user_id = $2 AND id = $3`,
    DELETE_SAVINGS_FUND: 
    `DELETE FROM savings_funds WHERE user_id = $1 AND id = $2`
}