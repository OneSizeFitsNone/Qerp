import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ICountry } from 'src/app/interfaces/country';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class CountryService { 
    private url = environment.API_URL + '/Country/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }
    
    private _countries: BehaviorSubject<Array<ICountry>> = new BehaviorSubject([]);
    public countries = this._countries.asObservable();

    private _country: BehaviorSubject<ICountry> = new BehaviorSubject(<ICountry>{});
    public country = this._country.asObservable();


    //get list for drop down
    public async getListForDD() {
        let getter = this.http.get<IReturnResult>(this.url, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        });

        let response = await lastValueFrom(getter)
        if(response?.success) {
            return response.object;
        }
        else {
            return []
        }
    }

}