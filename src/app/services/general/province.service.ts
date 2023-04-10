import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ProvinceService { 
    private url = environment.API_URL + '/Province/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    public async getListForDDByCountry(countryId: number) {
        let getter = this.http.get<IReturnResult>(this.url + "GetByCountry?countryId="+countryId, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        });

        let response = await lastValueFrom(getter)
        if(response.success) {
            return response.object;
        }
        else {
            return []
        }
    }

}