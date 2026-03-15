export const AccountBalanceQueries = {
    CREATE_ACCOUNT_BALANCE: `INSERT INTO account_balances (user_id, account_name, account_type, balance) 
    VALUES ($1, $2, $3, $4)
    RETURNING id, account_name AS "accountName", account_type AS "accountType", balance, created_at AS "createdAt", updated_at AS "updatedAt"`,
    
    FIND_ACCOUNT_BALANCES: `SELECT id, account_name AS "accountName", account_type AS "accountType", balance, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM account_balances
    WHERE user_id = $1`,
    
    FIND_ACCOUNT_BALANCE_BY_ID: `SELECT id, account_name AS "accountName", account_type AS "accountType", balance, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM account_balances
    WHERE user_id = $1 AND id = $2`,
    
    UPDATE_ACCOUNT_BALANCE: `UPDATE account_balances 
    SET account_name = $1, account_type = $2, balance = $3
    WHERE user_id = $4 AND id = $5
    RETURNING id, account_name AS "accountName", account_type AS "accountType", balance, created_at AS "createdAt", updated_at AS "updatedAt"`,
   
    DELETE_ACCOUNT_BALANCE: `DELETE from account_balances 
    WHERE user_id = $1 AND id = $2`,
    
    DELETE_ALL_ACCOUNT_BALANCES: `DELETE from account_balances 
    WHERE user_id = $1`
}