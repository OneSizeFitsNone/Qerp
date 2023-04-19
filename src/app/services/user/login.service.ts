import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import shajs from 'sha.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUser } from 'src/app/interfaces/user';
import { Router } from '@angular/router';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    public router: Router;
    private url = environment.API_URL + '/User/';
    public invalidLogin?: boolean;
    

    constructor(
      public translate: TranslateService,
      private toastr: ToastrService,
      _router: Router,
      private http: HttpClient,
      private jwtHelper : JwtHelperService,
    ){
        this.router = _router;
    }

    public login(username: string, password: string) {
        let user : IUser = <IUser>{};
        user.username = username;
        user.password = shajs('sha256').update(password).digest('hex');

        this.http.post<IReturnResult>(this.url + 'Login', user, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              const _user: IUser = <IUser>result.object;
              const token = _user.lastToken;
              localStorage.setItem("jwt", token);
              this.setUser(_user);
              this.toastr.success(this.translate.instant("info.user.loginsuccess"));
              this.router.navigate(["pages/dashboard"]);
              this.invalidLogin = false;
            }
            else {
              this.toastr.warning(this.translate.instant(result.message));
              this.invalidLogin = true;
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
            this.invalidLogin = true;
          }
        });
      }

    public logOut() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("currentuser");
      this.invalidLogin = true;
    }

    isUserAuthenticated() {
        const token = localStorage.getItem("jwt");
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          return true;
        }
        else {
          return false;
        }
    }

  public async isLoggedIn() {
    let getter = this.http.get(this.url + 'IsLoggedIn', {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
    
    return await lastValueFrom(getter);

  }

  public setUser(user:IUser) {
      localStorage.setItem("currentuser", JSON.stringify(user));
  }

  public getUser() {
      if(localStorage.getItem("currentuser") != null) {
          return JSON.parse(localStorage.getItem("currentuser")); 
      }
      else {
          
          this.toastr.warning(this.translate.instant("err.user.nocurrent"));
          this.logOut();
          return null;
      }
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("language", lang);
  }

  public getLanguage() {
    return localStorage.getItem("language");
  }
}

