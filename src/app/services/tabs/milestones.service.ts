import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, lastValueFrom } from 'rxjs';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IMilestone } from 'src/app/interfaces/milestone';

import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class MilestonesService { 
    private url = environment.API_URL + '/Milestone/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
        private appTypes: AppTypes 
    ){

    }

    private _milestones: BehaviorSubject<Array<IMilestone>> = new BehaviorSubject([]);
    public milestones = this._milestones.asObservable();

    private _milestone: BehaviorSubject<IMilestone> = new BehaviorSubject(<IMilestone>{});
    public milestone = this._milestone.asObservable();

    private searchRequest: Subscription;

    public async findMilestone(oMilestone: IMilestone) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }

      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(oMilestone), {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._milestones.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._milestones.next([]);
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }
    
    public async createMilestone(appTypeId: number = null, linkTypeId: number = null) {
        let oMilestone = <IMilestone>{};
        oMilestone.id = 0;
        oMilestone.name = "";
        oMilestone.linkedapptypeId = appTypeId ?? this.appTypes.prospect;
        oMilestone.linkedtypeId = linkTypeId;
        oMilestone.completed = false;
          
        this._milestone.next(oMilestone);
        let oCc = this._milestones.value;
        oCc.unshift(oMilestone);
        this._milestones.next(oCc);
    }

    public getMilestone(id: number) {
      this.http.get<IReturnResult>(this.url + `${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            this._milestone.next(result.object);
            let lstMilestones = this._milestones.value;
            let i = lstMilestones.findIndex(m => m.id == id);
            if(i > -1) {
              lstMilestones[i] = result.object;
              this._milestones.next(lstMilestones);
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

    public selectByApptype(apptypeId: number, id: number){
        this.http.get<IReturnResult>(this.url + `SelectByApptype?appTypeId=${apptypeId}&id=${id}`, {
            headers: new HttpHeaders({
              "Content-Type": "application/json"
            })
          }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                this._milestones.next(result.object);
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

    public saveMilestone(oMilestone: IMilestone, clearObject: boolean = false) {
        this.http.post<IReturnResult>(this.url, oMilestone, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              
              let oCr = <IMilestone>result.object;
              let oCrs = this._milestones.value;
              let i = oCrs.findIndex(i => i.id == oMilestone.id)
              if(i > -1) { oCrs[i]=oCr; }
              this._milestones.next(oCrs);

              if(clearObject) {
                this._milestone.next(<IMilestone>{});
              }
              else {
                this._milestone.next(oCr);
              }              

              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
              this.toastr.success(this.translate.instant('milestone.saved'));
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

      public saveFromSelect(oMilestone: IMilestone) {
        this.http.post<IReturnResult>(this.url, oMilestone, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              let arrContacts = this._milestones.value;
              arrContacts.unshift(result.object);
              this._milestones.next(arrContacts);
              //this._contact.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
              this.toastr.success(this.translate.instant('milestone.created'));
            }
            else {
              this._milestone.next(<IMilestone>{});
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
      }
  
      public async deleteMilestone(oMilestone: IMilestone) {
        if(oMilestone.id == 0) {
          let oCrs = this._milestones.value;
          let i = oCrs.findIndex(i => i.id == oMilestone.id);
          if(i > -1) { delete oCrs[i]; }
          this._milestones.next(oCrs);
          this._milestone.next(<IMilestone>{})
          return;
        }
  
        this.http.delete<IReturnResult>(this.url,{
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          body: oMilestone
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              let oCr = <IMilestone>result.object;
              let oCrs = this._milestones.value;
              let i = oCrs.findIndex(i => i.id == oCr.id)
              if(i > -1) { oCrs.splice(i, 1); }              
              this._milestones.next(oCrs);
              if(this._milestone.value.id == oCr.id) {
                this._milestone.next(<IMilestone>{})
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