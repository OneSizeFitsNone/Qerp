import { IClient } from "./client";
import { ICompany } from "./company";
import { IInvoice } from "./invoice";
import { IProject } from "./project";
import { ITask } from "./task";

export interface IInvoiceline { 
    id: number;
    companyId: number;
    clientId: number;
    projectId: number;
    taskId: number;
    invoiceId: number;
    created: Date;
    updated: Date;

    company: ICompany;
    client: IClient;
    project: IProject;
    task: ITask;
    invoice: IInvoice;
}