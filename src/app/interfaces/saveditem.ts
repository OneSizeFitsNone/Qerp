import { IUser } from "./user"

export interface ISaveditem {  
    id: number,
    userId: number,
    apptypeId: number,
    name: string,
    routelink: string,
    created: Date,

    user: IUser
}