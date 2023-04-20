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
    website:string;
    invoiceSameAddress: boolean;
    invoiceAddress: string;
    invoiceCityId: number;
    invoiceEmail: string;
    vat: string;
    phone: string;
    mobile: string;
    iban: string;
    created: string;
    updated: string;
    ProspectPrefix: string;
    ProspectNumber: number;
    ProjectPrefix: string;
    ProjectNumber: number;

    city: ICity; 
    invoiceCity: ICity;

}