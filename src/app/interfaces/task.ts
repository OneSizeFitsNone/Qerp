import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IImage } from "./image";
import { IInvoiceline } from "./invoiceline";
import { IProject } from "./project";
import { IProspect } from "./prospect";
import { IProspectgoal } from "./prospectgoal";

export interface ITask { 
    id: number;
    apptypeId: number;
    companyId: number;
    clientId: number;
    projectId: number;
    prospectId: number;
    prospectGoalId: number;
    contactId: number;
    title: string;
    description: string;
    deadline: Date;
    timer: number;
    maxTime: number;
    toInvoice: boolean;
    completed: boolean;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    contact: IContact;
    project: IProject;
    prospect: IProspect;
    prospectGoal: IProspectgoal;
    images: Array<IImage>;
    invoiceLines: Array<IInvoiceline>;

}