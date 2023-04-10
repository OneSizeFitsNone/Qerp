import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
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

    public findCompany(searchClient: IClient) {
        this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(searchClient), {
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
}