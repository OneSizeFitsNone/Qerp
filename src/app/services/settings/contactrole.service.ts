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

}