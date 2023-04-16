import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class SaveditemService {
    private url = environment.API_URL + '/Saveditem/';

    private _saveditems: BehaviorSubject<Array<ISaveditem>> = new BehaviorSubject([]);
    public saveditems = this._saveditems.asObservable();
  
    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private http: HttpClient,
    ){

    }

    public async getAll() {
        this.http.get<IReturnResult>(this.url, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._saveditems.next(result.object);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this._saveditems.next([]);
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public async save(oSaveditem: ISaveditem) {
        this.http.post<IReturnResult>(this.url, oSaveditem, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              let oCr = <ISaveditem>result.object;
              let oCrs = this._saveditems.value;
              if(oSaveditem.id == 0) {
                oCrs.unshift(oCr);
              }
              else {
                let i = oCrs.findIndex(i => i.id == oSaveditem.id)
                oCrs[i]=oCr;
              }
              oCrs.sort((a,b) => { return (a.created < b.created) ? 1 : (a.created > b.created) ? -1 : 0 });
              this._saveditems.next(oCrs);
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

      public async delete(oSaveditem: ISaveditem) {
        this.http.delete<IReturnResult>(this.url,{
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          body: oSaveditem
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              let oCrs = this._saveditems.value;
              let i = oCrs.findIndex(i => i.id == oSaveditem.id)
              oCrs.splice(i, 1);
              this._saveditems.next(oCrs);
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