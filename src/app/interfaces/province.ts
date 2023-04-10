import { ICity } from "./city";
import { ICompany } from "./company";
import { ICountry } from "./country";

export interface IProvince { 
    id: number;
    companyId: number;
    countryId: number;
    name: string;
    importName: string;

    company: ICompany;
    country: ICountry;
    cities: Array<ICity>;
    
}