import { IClient } from "./client";
import { ICompany } from "./company";
import { IInvoiceline } from "./invoiceline";
import { IProject } from "./project";

export interface IInvoice { 
    id: number;
    apptypeId: number;
    companyId: number;
    clientId: number;
    projectId: number;
    number: string;
    description: string;
    isCreditNote: boolean;
    sent: boolean;
    created: Date;

    company: ICompany;
    client: IClient;
    project: IProject;
    invoiceLines: Array<IInvoiceline>;
}