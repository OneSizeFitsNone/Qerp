import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IParameter } from 'src/app/interfaces/parameter';
import { IParametergroup } from 'src/app/interfaces/parametergroup';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ParameterService { 
    private url = environment.API_URL + '/Parameter/';

    private _groups: BehaviorSubject<Array<IParametergroup>> = new BehaviorSubject([]);
    public groups = this._groups.asObservable();

    private _parameters: BehaviorSubject<Array<IParameter>> = new BehaviorSubject([]);
    public parameters = this._parameters.asObservable();

    private _parameter: BehaviorSubject<IParameter> = new BehaviorSubject(<IParameter>{});
    public parameter = this._parameter.asObservable();

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    public async createParameter(groupId: number) {
        let oParameter = <IParameter>{};
        oParameter.id = 0;
        oParameter.groupId = groupId;
        let oParameters = this._parameters.value;
        oParameters.unshift(oParameter);
        this._parameters.next(oParameters);
        this._parameter.next(oParameter);
      }

    public async loadGroups() {
        this.http.get(this.url + `GetGroups`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
                if(result.success) { 
                    this._groups.next(result.object);
                    if(result.message.length > 0) {
                        this.toastr.warning(this.translate.instant(result.message));
                    }
                }
                else {
                    this._groups.next([]);
                    this.toastr.warning(this.translate.instant(result.message));
                }
            },
            error: err => {
                this.toastr.error(this.translate.instant("err") + err);
            }
        });
    }

    public async getById(id: number) {
        this.http.get(this.url + `${id}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
                if(result.success) { 
                    let oParameter: IParameter = result.object;
                    let oParameters = this._parameters.value;
                    let index = oParameters.findIndex(p => p.id == id);
                    if(index > -1) {
                        oParameters[index] = oParameter;
                        this._parameters.next(oParameters);
                    }
                    this._parameter.next(oParameter);
                    
                    if(result.message.length > 0) {
                        this.toastr.warning(this.translate.instant(result.message));
                    }
                }
                else {
                    this._groups.next([]);
                    this.toastr.warning(this.translate.instant(result.message));
                }
            },
            error: err => {
                this.toastr.error(this.translate.instant("err") + err);
            }
        });
    }

    public async getByGroupId(id: number) {
        this.http.get(this.url + `GetByGroupId?id=${id}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
                if(result.success) { 
                    this._parameters.next(result.object);
                }
                else {
                    this._groups.next([]);
                    this.toastr.warning(this.translate.instant(result.message));
                }
            },
            error: err => {
                this.toastr.error(this.translate.instant("err") + err);
            }
        });
    }

    public async getByGroupSystemCode(systemcode: string) {
        let getter = this.http.get<IReturnResult>(this.url + `getByGroupSystemCode?syscode=${systemcode}`, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        })

        let response = await lastValueFrom(getter)
        if(response?.success) {
            return response.object;
        }
        else {
            return [];
        }
    }

    public async save(oParameter: IParameter) {
        this.http.post(this.url, oParameter, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        }).subscribe({
            next: (result: IReturnResult) => {
                if(result.success) { 
                    let oPara: IParameter = result.object;
                    let oParas = this._parameters.value;
                    let index = oParas.findIndex(p => p.id == oParameter.id);
                    if(index > -1) {
                        oParas[index] = oPara;
                        this._parameters.next(oParas);
                    }
                    this._parameter.next(<IParameter>{});
                    
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

    public async delete(oParameter: IParameter) {
        if(oParameter.id == 0) {
            let oCrs = this._parameters.value;
            let i = oCrs.findIndex(i => i.id == 0)
            oCrs.splice(i, 1);
            this._parameters.next(oCrs);
            this._parameter.next(<IParameter>{})
            return;
          }

        this.http.delete<IReturnResult>(this.url,{
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            }),
            body: oParameter
        }).subscribe({
            next: (result: IReturnResult) => {
                if(result.success) {
                    let oCr = <IParameter>result.object;
                    let oCrs = this._parameters.value;
                    let i = oCrs.findIndex(i => i.id == oCr.id)
                    oCrs.splice(i, 1);
                    this._parameters.next(oCrs);
                    if(this._parameter.value.id == oCr.id) {
                        this._parameter.next(<IParameter>{})
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