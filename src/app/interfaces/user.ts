import { ICompany } from "./company";
import { IContact } from "./contact";

export interface IUser {
    id: number;
    companyId: number;
    contactId: number;
    username: string;
    password: string;
    lastToken: string;
    created: string;
    updated: string;

    company: ICompany;
    contact: IContact;
}