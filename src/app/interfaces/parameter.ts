import { ICompany } from "./company";
import { IParametergroup } from "./parametergroup";

export interface IParameter { 
    id: number;
    groupId: number;
    companyId: number;
    name: string;
    systemcode: string;
    description: number;
    created: Date;
    updated: Date;

    company: ICompany;
    group: IParametergroup;
}