import { IncomeDAO } from "../dao/income.dao";
import { Income, IncomeDTO } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for income management operations.
export class IncomeService{
    constructor(private incomeDAO: IncomeDAO){}

    // Creates a new income record for the user.
    async createIncome(incomeDTO: IncomeDTO): Promise<Income>{
        return await this.incomeDAO.createIncome(incomeDTO);
    }

    // Returns all income records for the user filtered by month.
    async getIncomeByDate(userId: number, month: string): Promise<Income[]>{
        return await this.incomeDAO.findIncomeByMonth(userId, month);
    }

    // Returns all income records for the user with no date filter.
    async getAllIncome(userId: number): Promise<Income[]>{
        return await this.incomeDAO.findAllIncome(userId);
    }

    // Returns a single income record by ID, throwing 404 if not found.
    async getIncomeById(userId: number, id: number): Promise<Income>{
        const result =  await this.incomeDAO.findIncomeById(userId, id);
        if (!result){
            throw new AppError('Income not found', 404);
        }
        return result;
    }

    // Updates an existing income record.
    async updateIncome(incomeDTO: IncomeDTO): Promise<Income>{
        return await this.incomeDAO.updateIncome(incomeDTO);
    }

    // Deletes an income record by ID, throwing 404 if not found.
    async deleteIncome(id: number, userId: number): Promise<void>{
        const result = await this.incomeDAO.deleteIncome(id, userId);
        if (!result){
            throw new AppError('Income not found', 404);
        }
    }

    // Returns the total sum of all income for the given month.
    async getMonthlyIncomeSum(userId: number, month: string): Promise<number>{
        return await this.incomeDAO.findMonthlyIncomeSum(userId, month);
    }
}
