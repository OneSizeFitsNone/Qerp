import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, lastValueFrom } from 'rxjs';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ITask } from 'src/app/interfaces/task';

import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/app/interfaces/user';

@Injectable()

export class TaskService { 
    private url = environment.API_URL + '/Task/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
        private appTypes: AppTypes 
    ){

    }

    private _tasks: BehaviorSubject<Array<ITask>> = new BehaviorSubject([]);
    public tasks = this._tasks.asObservable();

    private _task: BehaviorSubject<ITask> = new BehaviorSubject(<ITask>{});
    public task = this._task.asObservable();

    private searchRequest: Subscription;

    public async findTask(oTask: ITask) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }

      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(oTask), {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._tasks.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._tasks.next([]);
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }
    
    public async createTask(appTypeId: number = null, linkTypeId: number = null, deadline: Date = null) {
        let oTask = <ITask>{};
        oTask.id = 0;
        oTask.title = "";
        oTask.contactId = (<IUser>JSON.parse(localStorage.getItem("currentuser"))).contactId;
        oTask.sourceId = null;
        oTask.completed = false;
        oTask.deadline = deadline ? new Date(deadline) : null;
        
        if(appTypeId == this.appTypes.project) {
          oTask.projectId = linkTypeId;
        }
        else if(appTypeId == this.appTypes.prospect) {
          oTask.prospectId = linkTypeId;
        }
        else if(appTypeId == this.appTypes.milestone) {
          oTask.milestoneId = linkTypeId;
        }
          
        this._task.next(oTask);
        let oCc = this._tasks.value;
        oCc.unshift(oTask);
        this._tasks.next(oCc);
    }

    public getTask(myId: number) {
      this.http.get<IReturnResult>(this.url + `${myId}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            this._task.next(result.object);
            let lstTasks = this._tasks.value;
            let i = lstTasks.findIndex(m => m.id == myId);
            if(i > -1) {
              lstTasks[i] = result.object;
              this._tasks.next(lstTasks);
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
                this._tasks.next(result.object);
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

    public saveTask(oTask: ITask, clearObject: boolean = false) {
        this.http.post<IReturnResult>(this.url, oTask, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              
              let oCr = <ITask>result.object;
              let oCrs = this._tasks.value;
              let i = oCrs.findIndex(i => i.id == oTask.id)
              if(i > -1) { 
                oCrs[i]=oCr; 
              }
              oCrs.sort((a,b) => {
                if(new Date(a.deadline).getTime() > new Date(b.deadline).getTime()) return 1;
                if(new Date(a.deadline).getTime() < new Date(b.deadline).getTime()) return -1;
                if(a.title > b.title) return 1;
                if(a.title < b.title) return -1;
              });

              this._tasks.next(oCrs);

              if(clearObject) {
                this._task.next(<ITask>{});
              }
              else {
                this._task.next(oCr);
              }              

              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
              this.toastr.success(this.translate.instant('task.saved'));
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
  
      public async deleteTask(oTask: ITask) {
        if(oTask.id == 0) {
          let oCrs = this._tasks.value;
          let i = oCrs.findIndex(i => i.id == oTask.id);
          if(i > -1) { delete oCrs[i]; }
          this._tasks.next(oCrs);
          this._task.next(<ITask>{})
          return;
        }
  
        this.http.delete<IReturnResult>(this.url,{
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          body: oTask
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              let oCr = <ITask>result.object;
              let oCrs = this._tasks.value;
              let i = oCrs.findIndex(i => i.id == oCr.id)
              if(i > -1) { oCrs.splice(i, 1); }              
              this._tasks.next(oCrs);
              if(this._task.value.id == oCr.id) {
                this._task.next(<ITask>{})
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