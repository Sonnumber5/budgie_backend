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
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date
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
    incomeDate: Date,
    month: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface IncomeDTO{
    userId: number,
    amount: number,
    source: string,
    description: string,
    incomeDate: Date,
    month: Date
}