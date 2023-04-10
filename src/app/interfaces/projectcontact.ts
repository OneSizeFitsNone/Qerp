import { IContact } from "./contact";
import { IContactrole } from "./contactrole";
import { IProject } from "./project";

export interface IProjectcontact { 
    id: number;
    projectId: number;
    contactId: number;
    contactroleId: number;
    created: Date;
    updated: Date;

    project: IProject;
    contact: IContact;
    contactrole: IContactrole;
}