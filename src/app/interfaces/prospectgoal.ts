import { IProspect } from "./prospect";
import { ITask } from "./task";

export interface IProspectgoal { 
    id: number;
    prospectId: number;
    description: string;
    deadline: Date;
    created: Date;
    updated: Date;

    prospect: IProspect;
    tasks: Array<ITask>;
}