import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IContactrole } from "./contactrole";
import { IProject } from "./project";
import { ITask } from "./task";

export interface IAppTypeContact { 
    id: number,
    companyId: number,
    apptypeId: number,
    linkedId: number,
    contactId: number,
    clientId: number,
    contactroleId: number,
    description: string,
    created: Date,
    updated: Date,

    client: IClient,
    company: ICompany,
    contact: IContact,
    contactrole: IContactrole,
    project: IProject,
    task: ITask
}