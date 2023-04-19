import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IAppTypeContact } from 'src/app/interfaces/apptypecontact';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ApptypecontactsService { 
    private url = environment.API_URL + '/Apptypecontact/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
        private appTypes: AppTypes 
    ){

    }

    private _apptypecontacts: BehaviorSubject<Array<IAppTypeContact>> = new BehaviorSubject([]);
    public apptypecontacts = this._apptypecontacts.asObservable();

    private _apptypecontact: BehaviorSubject<IAppTypeContact> = new BehaviorSubject(<IAppTypeContact>{});
    public apptypecontact = this._apptypecontact.asObservable();

    public async createApptypecontact(appTypeId: number, linkedId: number) {
      let oApptypecontact = <IAppTypeContact>{};
      oApptypecontact.id = 0;
      oApptypecontact.apptypeId = appTypeId;
      oApptypecontact.linkedId = linkedId;
      
      this._apptypecontact.next(oApptypecontact);
      let oCc = this._apptypecontacts.value;
      oCc.unshift(oApptypecontact);
      this._apptypecontacts.next(oCc);
    }

    public async getApptypecontact(id) {
      return this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
      }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._apptypecontact.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._apptypecontact.next(<IAppTypeContact>{});
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public async getByApptypeLinkedId(apptypeId: number, linkTypeId: number) {
        this.http.get<IReturnResult>(this.url + `SelectByApptypeLinkedId?apptypeId=${apptypeId}&linkedId=${linkTypeId}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._apptypecontacts.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._apptypecontacts.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public saveApptypecontact(oApptypecontact: IAppTypeContact) {

      this.http.post<IReturnResult>(this.url, oApptypecontact, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            
            let oCr = <IAppTypeContact>result.object;
            let oCrs = this._apptypecontacts.value;
            let i = oCrs.findIndex(i => i.id == oApptypecontact.id)
            oCrs[i]=oCr;
            this._apptypecontacts.next(oCrs);
            this._apptypecontact.next(<IAppTypeContact>{});
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


    public async deleteApptypecontact(oApptypecontact: IAppTypeContact) {
      if(oApptypecontact.id == 0) {
        let oCrs = this._apptypecontacts.value;
        let i = oCrs.findIndex(i => i.id == oApptypecontact.id);
        delete oCrs[i];
        this._apptypecontacts.next(oCrs);
        this._apptypecontact.next(<IAppTypeContact>{})
        return;
      }

      this.http.delete<IReturnResult>(this.url,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        body: oApptypecontact
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let oCr = <IAppTypeContact>result.object;
            let oCrs = this._apptypecontacts.value;
            let i = oCrs.findIndex(i => i.id == oCr.id)
            oCrs.splice(i, 1);
            this._apptypecontacts.next(oCrs);
            if(this._apptypecontact.value.id == oCr.id) {
              this._apptypecontact.next(<IAppTypeContact>{})
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