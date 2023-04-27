import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { IProject } from "./project";
import { ITask } from "./task";

export interface IImage {
    id: number;
    linkedapptypeId: number;
    linkedtypeId: number;
    description: string;
    extension: string;
    filename: string;
    imagelink: string;
    thumblink: string;
    sort: number;
    created: Date;
    updated: Date;

    client: IClient;
    company: ICompany;
    contact: IContact;
    project: IProject;
    task: ITask;


    isEdit: boolean;
}