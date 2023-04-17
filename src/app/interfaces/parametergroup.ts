import { IParameter } from "./parameter";

export interface IParametergroup { 
    id: number;
    name: string;
    systemcode: string;
    sort: number;
    canEdit: boolean;

    Parameters: Array<IParameter>
}