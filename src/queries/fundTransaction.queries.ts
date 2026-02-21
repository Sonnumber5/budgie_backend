export const FundTransactionQueries = {
    CREATE_FUND_TRANSACTION: `INSERT INTO savings_fund_transactions (user_id, savings_fund_id, transaction_type, amount, description, transaction_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, savings_fund_id AS "savingsFundId", transaction_type AS "transactionType", amount, description, transaction_date AS "transactionDate", created_at AS "createdAt";`,
    FIND_FUND_TRANSACTIONS: `SELECT id, savings_fund_id AS "savingsFundId", transaction_type AS "transactionType", amount, description, transaction_date AS "transactionDate", created_at AS "createdAt"
    FROM savings_fund_transactions 
    WHERE user_id = $1 AND savings_fund_id = $2
    ORDER BY transaction_date DESC`,
    FIND_FUND_TRANSACTION_BY_ID: `SELECT id, savings_fund_id AS "savingsFundId", transaction_type AS "transactionType", amount, description, transaction_date AS "transactionDate", created_at AS "createdAt"
    FROM savings_fund_transactions 
    WHERE user_id = $1 AND id = $2`
}