import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IImage } from "./image";
import { IInvoiceline } from "./invoiceline";
import { IMilestone } from "./milestone";
import { IProject } from "./project";
import { IProspect } from "./prospect";

export interface ITask { 
    id: number;
    apptypeId: number;
    companyId: number;
    clientId: number;
    projectId: number;
    prospectId: number;
    milestoneId: number;
    contactId: number;
    title: string;
    description: string;
    deadline: Date;
    maxTime: number;
    toInvoice: boolean;
    completed: boolean;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    contact: IContact;
    milestone: IMilestone;
    project: IProject;
    prospect: IProspect;

    deadlineFrom: any;
    deadlineTo: any;
    forcedId: number;
    searchAppType: number;
    sourceId: number;

}