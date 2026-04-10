import { FundTransactionDAO } from "../dao/fundTransaction.dao";
import { SavingsFundDAO } from "../dao/savingsFund.dao";
import { SavingsFund, SavingsFundDTO } from "../types";
import { AppError } from "../utils/AppError";

// Business logic layer for savings fund CRUD and archive operations.
export class SavingsFundService{
    constructor(private savingsFundDAO: SavingsFundDAO, private fundTransactionDAO: FundTransactionDAO){}

    // Creates a new savings fund, throwing 409 if an active fund with the same name exists.
    async createSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        const activeSavingsFund = await this.savingsFundDAO.findSavingsFundByName(userId, savingsFundDTO.name);
        if (activeSavingsFund){
            throw new AppError('Active savings fund already exists', 409);
        }
        return await this.savingsFundDAO.createSavingsFund(userId, savingsFundDTO);
    }

    // Returns a savings fund by ID, throwing 404 if not found.
    async getSavingsFundById(userId: number, id: number): Promise<SavingsFund>{
        const result = await this.savingsFundDAO.findSavingsFundById(userId, id);
        if (!result){
            throw new AppError('Savings fund not found', 404);
        }
        return result;
    }

    // Returns all savings funds for the user, including archived ones if requested.
    async getSavingsFunds(userId: number, includeArchived: boolean): Promise<SavingsFund[]>{
        if (includeArchived === true){
            return await this.savingsFundDAO.findArchivedSavingsFunds(userId);
        } else{
            return await this.savingsFundDAO.findActiveSavingsFunds(userId);
        }
    }

    // Updates a savings fund's name and goal, throwing 409 if the new name conflicts with another fund.
    async updateSavingsFund(userId: number, savingsFundDTO: SavingsFundDTO): Promise<SavingsFund>{
        if (!savingsFundDTO.id){
            throw new AppError('Savings fund id required', 400);
        }
        const activeSavingsFund = await this.savingsFundDAO.findSavingsFundByName(userId, savingsFundDTO.name);
        if (activeSavingsFund && activeSavingsFund.id !== savingsFundDTO.id){
            throw new AppError('Active savings fund already exists', 409);
        }
        const result = await this.savingsFundDAO.updateSavingsFund(userId, savingsFundDTO);
        if (!result){
            throw new AppError('Savings fund not found', 404);
        }
        return result;
    }

    // Permanently deletes a savings fund, throwing 404 if not found.
    async deleteSavingsFund(userId: number, id: number): Promise<void>{
        const result = await this.savingsFundDAO.deleteSavingsFund(userId, id);
        if (!result){
            throw new AppError('Savings fund not found', 404);
        }
    }

    // Marks a savings fund as archived, throwing 404 if not found.
    async archiveSavingsFund(userId: number, id: number): Promise<SavingsFund>{
        const result = await this.savingsFundDAO.archiveSavingsFund(userId, id);
        if (!result){
            throw new AppError('Savings fund not found', 404);
        }
        return result;
    }
}
