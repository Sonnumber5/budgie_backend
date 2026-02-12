import { IncomeDAO } from "../database_access/income.dao";
import { Income } from "../types";

export class IncomeService{
    constructor(private incomeDAO: IncomeDAO){}

    async createIncome(userId: number, amount: string, source: string, description: string, incomeDate: string, month: string): Promise<Income>{
        return await this.incomeDAO.createIncome(userId, amount, source, description, incomeDate, month);
    }
}