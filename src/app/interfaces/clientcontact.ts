import { IClient } from "./client";
import { IContact } from "./contact";
import { IContactrole } from "./contactrole";

export interface IClientcontact { 
    id: number;
    clientId: number;
    contactId: number;
    contactroleId: number;
    created: Date;
    updated: Date;
    
    client: IClient;
    contact: IContact;
    contactRole: IContactrole;
}