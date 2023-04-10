import { ICompany } from "./company";

export interface IVat { 
    id:number;
    companyId: number;
    percentage: number;
    description: string;
    created: Date;
    updated: Date;
    
    company: ICompany;
}