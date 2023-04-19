import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IParameter } from "./parameter";

export interface IProspect { 

    id: number;
    companyId: number;
    clientId: number;
    contactId: number;
    prospectTypeId: number;
    number: string;
    deadline: Date;
    description: string;
    estimatedBudget: number;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    contact: IContact;
    prospectType: IParameter;

    forcedId: number;
    deadlineFrom: Date;
    deadlineTo: Date;

}