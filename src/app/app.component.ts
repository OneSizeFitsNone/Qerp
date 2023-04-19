import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from './services/user/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'az-root',
  encapsulation: ViewEncapsulation.None,
  template:`<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  providers: [LoginService]
})

export class AppComponent {

  constructor(
    public translate: TranslateService,
    private loginService: LoginService,
    private router: Router
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('nl');
    if(localStorage.getItem("language") != null){
      translate.use(localStorage.getItem("language"));
    }
    else {
      translate.use('en');
    }    
  }



}
