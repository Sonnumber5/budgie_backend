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
    password_hash: string;
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
    userId: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: string,
    month: string
}