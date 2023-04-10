import { IContact } from "./contact";
import { IProject } from "./project";
import { IProspectgoal } from "./prospectgoal";
import { ITask } from "./task";

export interface IProspect { 
    id: number;
    projectId: number;
    contactId: number;
    deadline: Date;
    description: string;
    estimatedBudget: number;
    created: Date;
    updated: Date;

    contact: IContact;
    project: IProject;
    prospectgoals: Array<IProspectgoal>;
    tasks: Array<ITask>;
}