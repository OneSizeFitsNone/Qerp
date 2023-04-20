import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ICompany } from 'src/app/interfaces/company';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class MyCompanyService { 
    private url = environment.API_URL + '/Company/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _company: BehaviorSubject<ICompany> = new BehaviorSubject(<ICompany>{});
    public company = this._company.asObservable();

    public getCompany() {
        this.http.get<IReturnResult>(this.url, {
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
              this._company.next(<ICompany>{});
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public saveCompany(oCompany: ICompany) {
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
          }
          else {
            this._company.next(<ICompany>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }


}