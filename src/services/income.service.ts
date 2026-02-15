import { IncomeDAO } from "../database_access/income.dao";
import { Income, IncomeDTO } from "../types";
import { AppError } from "../utils/AppError";

export class IncomeService{
    constructor(private incomeDAO: IncomeDAO){}

    async createIncome(incomeDTO: IncomeDTO): Promise<Income>{
        return await this.incomeDAO.createIncome(incomeDTO);
    }

    async getIncomeByDate(userId: number, month: string): Promise<Income[]>{
        return await this.incomeDAO.findIncomeByMonth(userId, month);
    }

    async getAllIncome(userId: number): Promise<Income[]>{
        return await this.incomeDAO.findAllIncome(userId);
    }

    async getIncomeById(userId: number, id: number): Promise<Income>{
        const result =  await this.incomeDAO.findIncomeById(userId, id);
        if (!result){
            throw new AppError('Income not found', 404);
        }
        return result;
    }

    async updateIncome(incomeDTO: IncomeDTO): Promise<Income>{
        return await this.incomeDAO.updateIncome(incomeDTO);
    }

    async deleteIncome(id: number, userId: number): Promise<void>{
        const result = await this.incomeDAO.deleteIncome(id, userId);
        if (!result){
            throw new AppError('Income not found', 404);
        }
    }
}