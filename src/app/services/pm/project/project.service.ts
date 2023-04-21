import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IProject } from 'src/app/interfaces/project';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ProjectService { 
    private url = environment.API_URL + '/Project/';

    private apptypes: AppTypes = new AppTypes;
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _projects: BehaviorSubject<Array<IProject>> = new BehaviorSubject([]);
    public projects = this._projects.asObservable();

    private _project: BehaviorSubject<IProject> = new BehaviorSubject(<IProject>{});
    public project = this._project.asObservable();

    private searchRequest: Subscription;

    public findProject(searchProject: IProject) {
      if(this.searchRequest) { this.searchRequest.unsubscribe() }

      this.searchRequest = this.http.post<IReturnResult>(this.url + 'Search/', JSON.stringify(searchProject), {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) { 
              this._projects.next(result.object);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this._projects.next([]);
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
    }

    public createProject(st : number = null, sl: number = null) {
      let oProject : IProject = <IProject>{};
      oProject.id = 0;
      oProject.contactId = (st == this.apptypes.contact) ? sl : null;
      oProject.clientId = (st == this.apptypes.client) ? sl : null;

      this._project.next(oProject);
    }

    public getProject(id: number) {
      this.http.get<IReturnResult>(this.url + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._project.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
          }
          else {
            this._project.next(<IProject>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveProject(oProject: IProject) {
      this.http.post<IReturnResult>(this.url, oProject, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) { 
            this._project.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('project.saved'));
          }
          else {
            this._project.next(<IProject>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

    public saveFromSelect(name: string) {
      let oProject: IProject = <IProject>{};

      this.http.post<IReturnResult>(this.url, oProject, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (result: IReturnResult) => {
          if(result.success) {
            let arrProjects = this._projects.value;
            arrProjects.unshift(result.object);
            this._projects.next(arrProjects);

            //this._company.next(result.object);
            if(result.message.length > 0) {
                this.toastr.warning(this.translate.instant(result.message));
            }
            this.toastr.success(this.translate.instant('project.created'));
          }
          else {
            this._project.next(<IProject>{});
            this.toastr.warning(this.translate.instant(result.message));
          }
        },
        error: err => {
          this.toastr.error(this.translate.instant("err") + err);
        }
      });
    }

}