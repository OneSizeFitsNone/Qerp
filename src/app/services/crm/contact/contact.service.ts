import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ContactService { 
    private url = environment.API_URL + '/Contact/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _contacts: BehaviorSubject<Array<IContact>> = new BehaviorSubject([]);
    public contacts = this._contacts.asObservable();

    private _contact: BehaviorSubject<IContact> = new BehaviorSubject(<IContact>{});
    public contact = this._contact.asObservable();

    private searchRequest: Subscription;

    public findContact(searchContact: IContact) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }
      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(searchContact), {
            headers: new HttpHeaders({
              "Content-Type": "application/json"
            })
          }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._contacts.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._contacts.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public createContact() {
      let oContact : IContact = <IContact>{};
      oContact.id = 0;
      this._contact.next(oContact);
    }

    public getContact(id: number) {
      this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._contact.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this._contact.next(<IContact>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveContact(contact: IContact) {
      this.http.post<IReturnResult>(this.url, contact, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._contact.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('contact.saved'));
          }
          else {
            this._contact.next(<IContact>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveFromSelect(name: string) {
      let contact: IContact = <IContact>{};
      contact.name = name.split(' ').slice(0, -1).join(' ');
      contact.surname = name.split(' ').slice(-1).join(' ');
      this.http.post<IReturnResult>(this.url, contact, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            let arrContacts = this._contacts.value;
            arrContacts.unshift(result.object);
            this._contacts.next(arrContacts);
            //this._contact.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('contact.created'));
          }
          else {
            this._contact.next(<IContact>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

}