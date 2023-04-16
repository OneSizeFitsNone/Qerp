import { Component, ViewEncapsulation } from '@angular/core';
import { IUser } from 'src/app/interfaces/user';
import { LoginService } from 'src/app/services/user/login.service';
import { AppState } from '../../../app.state';
import { SidebarService } from '../sidebar/sidebar.service';
import { ImageModule } from 'src/app/components/images/image.module';
import { AppTypes } from 'src/app/interfaces/apptypes';

@Component({
  selector: 'az-navbar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [ SidebarService, AppTypes ]
})

export class NavbarComponent {
    public isMenuCollapsed:boolean = false;
    public user: IUser
    public language: string;
    
    constructor(
        private _state:AppState, 
        private _sidebarService:SidebarService,
        private loginService: LoginService,
        public appTypes: AppTypes
    ) {
        
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        this.user = loginService.getUser()
        this.language = loginService.getLanguage();
    }

    public closeSubMenus(){
       /* when using <az-sidebar> instead of <az-menu> uncomment this line */
      // this._sidebarService.closeAllSubMenus();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed; 
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);        
    }

    public setLanguage(lang: any) {
        this.loginService.setLanguage(lang);
    }

    public logOut() {
        this.loginService.logOut();
    }
}
