import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IImage } from "./image";
import { IInvoice } from "./invoice";
import { IInvoiceline } from "./invoiceline";
import { IParameter } from "./parameter";
import { IProjectcontact } from "./projectcontact";
import { IProspect } from "./prospect";
import { ITask } from "./task";

export interface IProject { 
    id: number;
    apptypeId: number;
    companyId: number;
    clientId: number;
    contactId: number;
    projectTypeId: number;
    prospectId: number;
    number: string;
    name: string;
    description: string;
    deadline: Date;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    contact: IContact;
    projectType: IParameter;
    Prospect: IProspect;

    forcedId: number;    

}