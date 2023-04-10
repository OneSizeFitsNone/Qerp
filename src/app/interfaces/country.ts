import { ICity } from "./city";
import { IProvince } from "./province";

export interface ICountry { 
    id: number;
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
    
    cities: Array<ICity>;
    provinces: Array<IProvince>;
}