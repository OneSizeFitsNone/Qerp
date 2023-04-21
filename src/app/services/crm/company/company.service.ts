import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IClient } from 'src/app/interfaces/client';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class CompanyService { 
    private url = environment.API_URL + '/Client/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _companies: BehaviorSubject<Array<IClient>> = new BehaviorSubject([]);
    public companies = this._companies.asObservable();

    private _company: BehaviorSubject<IClient> = new BehaviorSubject(<IClient>{});
    public company = this._company.asObservable();

    private searchRequest: Subscription;

    public findCompany(searchClient: IClient) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }
      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(searchClient), {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._companies.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._companies.next([]);
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public createCompany() {
      let oCompany : IClient = <IClient>{};
      oCompany.id = 0;
      oCompany.invoiceSameAddress = true;
      this._company.next(oCompany);
    }

    public getCompany(id: number) {
      this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._company.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this._company.next(<IClient>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveCompany(oCompany: IClient) {
      this.http.post<IReturnResult>(this.url, oCompany, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._company.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('company.saved'));
          }
          else {
            this._company.next(<IClient>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveFromSelect(name: string) {
      let client: IClient = <IClient>{};
      client.name = name;

      this.http.post<IReturnResult>(this.url, client, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let arrCompanies = this._companies.value;
            arrCompanies.unshift(result.object);
            this._companies.next(arrCompanies);

            //this._company.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('company.created'));
          }
          else {
            this._company.next(<IClient>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

}