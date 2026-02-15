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
    userId: number,
    categoryId: number,
    vendor: string,
    amount: number,
    description: string,
    expenseDate: string,
    month: string
}