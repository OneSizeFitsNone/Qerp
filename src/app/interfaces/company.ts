import { ICity } from "./city";
import { IClient } from "./client";
import { IContact } from "./contact";
import { IContactrole } from "./contactrole";
import { IImage } from "./image";
import { IInvoice } from "./invoice";
import { IInvoiceline } from "./invoiceline";
import { IProject } from "./project";
import { IProvince } from "./province";
import { ITask } from "./task";
import { IUser } from "./user";
import { IVat } from "./vat";


export interface ICompany { 
    id: number;
    apptypeId: number;
    name: string;
    address: string;
    cityId: number;
    description: string;
    email: string;
    invoiceAddress: string;
    invoiceCityId: number;
    invoiceEmail: string;
    vat: string;
    phone: string;
    mobile: string;
    iban: string;
    created: string;
    updated: string;
    city: ICity; 
    invoiceCity: ICity;

    cities: Array<ICity>;
    clients: Array<IClient>;
    contactroles: Array<IContactrole>;
    contacts: Array<IContact>;
    images: Array<IImage>;
    invoicelines: Array<IInvoiceline>;
    invoices: Array<IInvoice>;
    projects: Array<IProject>;
    provinces: Array<IProvince>;
    tasks: Array<ITask>;
    users: Array<IUser>;
    vats: Array<IVat>;
}