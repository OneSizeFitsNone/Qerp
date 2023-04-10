import { IClient } from "./client";
import { ICompany } from "./company";
import { IContact } from "./contact";
import { ICountry } from "./country";
import { IProvince } from "./province";

export interface ICity {
    id: number;
    companyId: number;
    countryId: number;
    provinceId: number;
    postalCode: string;
    name: string;

    codeAndName: string; 
    
    company: ICompany;
    country: ICountry;
    province: IProvince;
    clientCities: Array<IClient>;
    clientInvoiceCities: Array<IClient>;
    companyCities: Array<ICompany>;
    companyInvoiceCities: Array<ICompany>;
    contacts: Array<IContact>;
}