import { Request } from "express";

//---------Authentication---------//
export interface AuthRequest extends Request {
    user: {
        userId: number;
        email: string;
        name: string;
    };
}

export interface User {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}

export interface loginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
    }
}


//---------CATEGORIES---------//

export interface Category {
    id: number,
    name: string,
    createdAt: string
}

export interface CategoryDTO{
    id?: number,
    userId: number,
    name: string
}


//---------INCOME---------//

export interface Income {
    id: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: string,
    createdAt: string,
    updatedAt: string
}

export interface IncomeDTO{
    id?: number,
    userId: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: string,
    month: string
}

//---------EXPENSE---------//

export interface Expense {
    id: number,
    categoryId: number,
    categoryName: string,
    vendor: string,
    amount: number,
    description: string,
    expenseDate: string,
    createdAt: string,
    updatedAt: string
}

export interface ExpenseDTO{
    categoryId: number,
    userId: number,
    vendor: string,
    amount: number,
    description: string,
    expenseDate: string,
    month: string
}


//---------MONTHLY BUDGET---------//

export interface MonthlyBudget{
    id: number, 
    month: string,
    expectedIncome: number,
    categoryBudgets: CategoryBudget[],
    createdAt: string,
    updatedAt: string
}

export interface MonthlyBudgetDTO{
    id?: number, 
    userId: number,
    month?: string,
    expectedIncome: number,
    categoryBudgetDTOs: CategoryBudgetDTO[],
}


//---------CATEGORY BUDGET---------//

export interface CategoryBudget{
    id: number,
    monthlyBudgetId: number,
    categoryId: number,
    categoryName: string,
    budgetedAmount: number,
    createdAt: string,
    updatedAt: string
}

export interface CategoryBudgetDTO{
    id?: number,
    userId: number,
    monthlyBudgetId?: number,
    categoryId: number,
    categoryName?: string,
    budgetedAmount: number
}



//---------SAVINGS FUNDS---------//

export interface SavingsFund{
    id: number,
    //userId: number,
    name: string,
    goal: number,
    balance: number,
    archivedAt: string
}

export interface SavingsFundDTO{
    id?: number,
    name: string,
    goal: number,
    balance?: number,
    archivedAt?: string
}



//---------SAVINGS FUND TRANSACTIONS---------//

export type TransactionType = 'contribution' | 'expenditure' | 'initial_balance' | 'transfer_in' | 'transfer_out' | 'adjustment'

export interface FundTransaction{
    id: number, 
    savingsFundId: number,
    transactionType: TransactionType,
    amount: number,
    description: string,
    transactionDate: string,
    month: string,
    relatedFundId?: number,
    createdAt: string
}

export interface FundTransactionDTO{
    id?: number, 
    savingsFundId: number,
    transactionType: TransactionType,
    amount: number,
    description: string,
    transactionDate: string,
    month: string,
    relatedFundId?: number,
}

