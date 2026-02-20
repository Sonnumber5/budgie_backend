import { SavingsFundDAO } from "../database_access/savingsFund.dao";
import { SavingsFund, SavingsFundDTO } from "../types";
import { AppError } from "../utils/AppError";

export class SavingsFundService{
    constructor(private savingsFundDAO: SavingsFundDAO){}

    async createSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        const activeSavingsFund = await this.savingsFundDAO.findSavingsFundByName(userId, savingsFundDTO.name);
        if (activeSavingsFund){
            throw new AppError('Active savings fund already exists', 409);
        }
        return await this.savingsFundDAO.createSavingsFund(userId, savingsFundDTO);
    }

    async getSavingsFundById(userId: number, id: number): Promise<SavingsFund>{
        const result = await this.savingsFundDAO.findSavingsFundById(userId, id);
        if (!result){
            throw new AppError('Savings fund not found', 404);
        }
        return result;
    }

    async getSavingsFunds(userId: number): Promise<SavingsFund[]>{
        return await this.savingsFundDAO.findSavingsFunds(userId);
    }
}