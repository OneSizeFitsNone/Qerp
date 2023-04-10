import { IClient } from "./client";
import { ICompany } from "./company";
import { IImage } from "./image";
import { IInvoice } from "./invoice";
import { IInvoiceline } from "./invoiceline";
import { IProjectcontact } from "./projectcontact";
import { IProspect } from "./prospect";
import { ITask } from "./task";

export interface IProject { 
    id: number;
    apptypeId: number;
    companyId: number;
    clientId: number;
    isProspect: boolean;
    number: number;
    name: string;
    description: string;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    images: Array<IImage>;
    invoiceLines: Array<IInvoiceline>;
    invoices: Array<IInvoice>;
    projectcontacts: Array<IProjectcontact>;
    prospects: Array<IProspect>;
    tasks: Array<ITask>;
}