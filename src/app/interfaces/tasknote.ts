import { IContact } from "./contact";

export interface ITasknote { 
    id: number;
    contactId: number;
    note: string;
    created: Date;
    updated: Date;

    contact: IContact;
}