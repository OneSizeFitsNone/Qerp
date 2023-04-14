import { ICity } from "./city";
import { IClientcontact } from "./clientcontact";
import { ICompany } from "./company";
import { IImage } from "./image";
import { IProjectcontact } from "./projectcontact";
import { IProspect } from "./prospect";
import { ITask } from "./task";
import { ITasknote } from "./tasknote";
import { IUser } from "./user";

export interface IContact { 
    id: number;
    apptypeId: number;
    companyId: number;
    name: string;
    surname: string;
    fullname: string;
    address: string;
    cityId: number;
    description: string;
    email: string;
    phone: string;
    mobile: string;
    created: Date;
    updated: Date;
    
    city: ICity;
    company: ICompany;
    clientcontacts: Array<IClientcontact>;
    images: Array<IImage>;
    projectcontacts: Array<IProjectcontact>;
    prospects: Array<IProspect>;
    tasknotes: Array<ITasknote>;
    tasks: Array<ITask>;
    users: Array<IUser>;

    forcedId: number;
}