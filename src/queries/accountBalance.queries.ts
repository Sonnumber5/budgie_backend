export const AccountBalanceQueries = {
    CREATE_ACCOUNT_BALANCE: `INSERT INTO account_balances (user_id, account_name, account_type, balance) VALUES ($1, $2, $3, $4)
    RETURNING id, account_name AS "accountName", account_type AS "accountType", balance, created_at AS "createdAt", updated_at AS "updatedAt"`,
    
}