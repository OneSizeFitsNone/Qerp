import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IClientcontact } from 'src/app/interfaces/clientcontact';

import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ClientcontactsService { 
    private url = environment.API_URL + '/Clientcontact/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
        private appTypes: AppTypes 
    ){

    }

    private _clientcontacts: BehaviorSubject<Array<IClientcontact>> = new BehaviorSubject([]);
    public clientcontacts = this._clientcontacts.asObservable();

    private _clientcontact: BehaviorSubject<IClientcontact> = new BehaviorSubject(<IClientcontact>{});
    public clientcontact = this._clientcontact.asObservable();

    public async createClientcontact(appTypeId: number, linkTypeId: number) {
      let oClientcontact = <IClientcontact>{};
      oClientcontact.id = 0;
      
      if(appTypeId == this.appTypes.contact)
        oClientcontact.contactId = linkTypeId;
      else if(appTypeId == this.appTypes.client)
        oClientcontact.clientId = linkTypeId;

      this._clientcontact.next(oClientcontact);
      let oCc = this._clientcontacts.value;
      oCc.unshift(oClientcontact);
      this._clientcontacts.next(oCc);
    }

    public async getClientcontact(id) {
      return this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
      }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._clientcontact.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._clientcontact.next(<IClientcontact>{});
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public async getByContact(id: number) {
        this.http.get<IReturnResult>(this.url + `GetByContact/${id}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._clientcontacts.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._clientcontacts.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public async getByCompany(id: number) {
        this.http.get<IReturnResult>(this.url + `GetByClient/${id}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._clientcontacts.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._clientcontacts.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public saveClientcontact(oClientcontact: IClientcontact, appType: number) {
      this.http.post<IReturnResult>(this.url, oClientcontact, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            
            let oCr = <IClientcontact>result.object;
            let oCrs = this._clientcontacts.value;
            let i = oCrs.findIndex(i => i.id == oClientcontact.id)
            oCrs[i]=oCr;
            oCrs.sort((a,b) => { 
                if(appType == this.appTypes.contact) {
                    return (a.client.name < b.client.name) ? -1 : (a.client.name > b.client.name) ? 1 : 0 
                }
                else {
                    return (a.contact.name < b.contact.name) ? -1 : (a.contact.name > b.contact.name) ? 1 : 0 
                }
            });
            this._clientcontacts.next(oCrs);
            this._clientcontact.next(<IClientcontact>{});
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }


    public async deleteClientcontact(oClientcontact: IClientcontact) {
      if(oClientcontact.id == 0) {
        let oCrs = this._clientcontacts.value;
        let i = oCrs.findIndex(i => i.id == oClientcontact.id);
        delete oCrs[i];
        this._clientcontacts.next(oCrs);
        this._clientcontact.next(<IClientcontact>{})
        return;
      }

      this.http.delete<IReturnResult>(this.url,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        body: oClientcontact
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let oCr = <IClientcontact>result.object;
            let oCrs = this._clientcontacts.value;
            let i = oCrs.findIndex(i => i.id == oCr.id)
            oCrs.splice(i, 1);
            this._clientcontacts.next(oCrs);
            if(this._clientcontact.value.id == oCr.id) {
              this._clientcontact.next(<IClientcontact>{})
            }
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

}