import { SavingsFundDAO } from "../database_access/savingsFund.dao";

export class SavingsFundService{
    constructor(private savingsFundDAO: SavingsFundDAO){}
}