import { ICompany } from "./company";
import { IProject } from "./project";
import { IProspect } from "./prospect";

export interface IMilestone { 
    id: number;
    companyId: number;
    apptypeId: number;
    linkedapptypeId: number;
    linkedtypeId: number;
    name: string;
    description: string;
    deadline: Date;
    completed: boolean;
    created: Date;
    updated: Date;

    company: ICompany;
    project: IProject;
    prospect: IProspect;

    taskCount: number;
    tasksCompleted: number;
    percentageCompleted: number;

    deadlineFrom: Date;
    deadlineTo: Date;
    typeNumber: string;
    forcedId: number;
}