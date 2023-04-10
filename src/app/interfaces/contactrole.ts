import { IClientcontact } from "./clientcontact";
import { ICompany } from "./company";
import { IProjectcontact } from "./projectcontact";

export interface IContactrole { 
    id: number;
    companyId: number;
    name: string;
    description: string;
    created: Date;
    updated: Date;

    company: ICompany;
    clientcontacts: Array<IClientcontact>;
    projectcontacts: Array<IProjectcontact>;
}