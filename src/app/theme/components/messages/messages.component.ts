import {Component, ViewEncapsulation} from '@angular/core';

import {MessagesService} from './messages.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { Router } from '@angular/router';

@Component({
    selector: 'az-messages',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./messages.component.scss'],
    templateUrl: './messages.component.html',
    providers: [MessagesService, AppTypes]
})

export class MessagesComponent{     
    public messages:Array<Object>;
    public notifications:Array<Object>;
    public tasks:Array<Object>;
    public savedItems: Array<ISaveditem>;

    constructor (
        private _messagesService:MessagesService,
        private saveditemService:SaveditemService,
        public appTypes: AppTypes,
        public router: Router
    ){
        this.messages = _messagesService.getMessages();
        this.notifications = _messagesService.getNotifications();
        this.tasks = _messagesService.getTasks();
    }

    ngOnInit(){
        this.saveditemService.saveditems.subscribe(si => {
            this.savedItems = si;
        });
        
        this.saveditemService.getAll();
    }

    public onDeleteSavedItem(item: ISaveditem) {
        this.saveditemService.delete(item);
    }



}