import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IContactrole } from 'src/app/interfaces/contactrole';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ContactroleService { 
    private url = environment.API_URL + '/Contactrole/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _contactroles: BehaviorSubject<Array<IContactrole>> = new BehaviorSubject([]);
    public contactroles = this._contactroles.asObservable();

    private _contactrole: BehaviorSubject<IContactrole> = new BehaviorSubject(<IContactrole>{});
    public contactrole = this._contactrole.asObservable();

    public async createContactrole() {
      let oContactrole = <IContactrole>{};
      oContactrole.id = 0;
      this._contactrole.next(oContactrole);
      let oCrs = this._contactroles.value;
      oCrs.unshift(oContactrole);
      this._contactroles.next(oCrs);
    }

    public async getContactrole(id) {
      return this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
      }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._contactrole.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._contactrole.next(<IContactrole>{});
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public async getContactroles() {
        this.http.get<IReturnResult>(this.url, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._contactroles.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._contactroles.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });

    }

    public saveRole(oContactrole: IContactrole) {
      this.http.post<IReturnResult>(this.url, oContactrole, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            
            let oCr = <IContactrole>result.object;
            let oCrs = this._contactroles.value;
            let i = oCrs.findIndex(i => i.id == oContactrole.id)
            oCrs[i]=oCr;
            oCrs.sort((a,b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0 });
            this._contactroles.next(oCrs);
            this._contactrole.next(<IContactrole>{});
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


    public async deleteRole(oContactrole: IContactrole) {
      this.http.delete<IReturnResult>(this.url,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        body: oContactrole
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let oCr = <IContactrole>result.object;
            let oCrs = this._contactroles.value;
            let i = oCrs.findIndex(i => i.id == oCr.id)
            oCrs.splice(i, 1);
            this._contactroles.next(oCrs);
            if(this._contactrole.value.id == oCr.id) {
              this._contactrole.next(<IContactrole>{})
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