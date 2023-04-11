import { ICity } from "./city";
import { IClientcontact } from "./clientcontact";
import { ICompany } from "./company";
import { IImage } from "./image";
import { IInvoice } from "./invoice";
import { IInvoiceline } from "./invoiceline";
import { IProject } from "./project";
import { ITask } from "./task";

export interface IClient {
    id: number;
    apptypeId: number;
    companyId: number;
    name: string;
    address: string;
    cityId: number
    description: string;
    email: string;
    invoiceSameAddress: boolean;
    invoiceAddress: string;
    invoicePostalCode: string;
    invoiceCityId: number;
    invoiceEmail: string;
    vat: string;
    phone: string;
    mobile: string;
    iban: string;
    created: Date;
    updated: Date;

    company: ICompany;
    city: ICity;
    invoiceCity: ICity;
    clientcontacts: Array<IClientcontact>;
    images: Array<IImage>;
    invoiceLines: Array<IInvoiceline>;
    invoices: Array<IInvoice>;
    projects: Array<IProject>;
    tasks: Array<ITask>;
}