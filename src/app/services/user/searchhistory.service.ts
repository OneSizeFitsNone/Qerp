import { Injectable } from '@angular/core';
import { ISearchhistory } from 'src/app/interfaces/searchhistory';

@Injectable({
    providedIn: 'root'
})

export class SearchhistoryService {
    private searchhistory: Array<ISearchhistory> = []

    constructor(){}

    public addHistory(apptypeId: number, object: any) {
        let i = this.searchhistory.findIndex(s => s.apptypeId == apptypeId);
        if(i >= 0) {
            this.searchhistory[i].object = object;
        }
        else {
            this.searchhistory.push(<ISearchhistory>{
                apptypeId : apptypeId,
                object : object,
            });
        }
    }

    public getHistory(apptypeId): any {
        let oHistory = this.searchhistory.find(s => s.apptypeId == apptypeId);
        if(oHistory) {
            return oHistory.object;
        }
        else {
            return null;
        }
    }

}