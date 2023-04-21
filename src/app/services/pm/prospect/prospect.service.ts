import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IProspect } from 'src/app/interfaces/prospect';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ProspectService { 
    private url = environment.API_URL + '/Prospect/';

    private apptypes: AppTypes = new AppTypes;
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _prospects: BehaviorSubject<Array<IProspect>> = new BehaviorSubject([]);
    public prospects = this._prospects.asObservable();

    private _prospect: BehaviorSubject<IProspect> = new BehaviorSubject(<IProspect>{});
    public prospect = this._prospect.asObservable();

    private searchRequest: Subscription;

    public findProspect(searchProspect: IProspect) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }

      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(searchProspect), {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._prospects.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._prospects.next([]);
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public createProspect(st : number = null, sl: number = null) {
      let oProspect : IProspect = <IProspect>{};
      oProspect.id = 0;
      oProspect.contactId = (st == this.apptypes.contact) ? sl : null;
      oProspect.clientId = (st == this.apptypes.client) ? sl : null;

      this._prospect.next(oProspect);
    }

    public getProspect(id: number) {
      this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._prospect.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this._prospect.next(<IProspect>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveProspect(oProspect: IProspect) {
      this.http.post<IReturnResult>(this.url, oProspect, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._prospect.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('prospect.saved'));
          }
          else {
            this._prospect.next(<IProspect>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveFromSelect(name: string) {
      let oProspect: IProspect = <IProspect>{};

      this.http.post<IReturnResult>(this.url, oProspect, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let arrProspects = this._prospects.value;
            arrProspects.unshift(result.object);
            this._prospects.next(arrProspects);

            //this._company.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('prospect.created'));
          }
          else {
            this._prospect.next(<IProspect>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

}