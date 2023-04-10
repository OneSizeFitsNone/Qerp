import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from '../app.state';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'az-pages',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ AppState ]
})
export class PagesComponent implements OnInit {
    public router: Router;
    public isMenuCollapsed:boolean = false;
  
    constructor(private _state:AppState,
                private _router: Router, 
                private _location:Location,
                private jwtHelper: JwtHelperService) {
        this.router = _router;
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });    
    }

    ngOnInit() {
        // if(!this.isUserAuthenticated) {
        //     this.router.navigate(['pages/login']);
        // }
        this.getCurrentPageName();
    }

    public getCurrentPageName():void{       
        let url = this._location.path();
        let hash = (window.location.hash) ? '#' : '';    
        setTimeout(function(){
            let subMenu = jQuery('a[href="'+ hash + url + '"]').closest("li").closest("ul");            
            window.scrollTo(0, 0);
            subMenu.closest("li").addClass("sidebar-item-expanded"); 
            subMenu.slideDown(250);    
        });
    }

    public hideMenu():void{
        this._state.notifyDataChanged('menu.isCollapsed', true);    
    }

    public ngAfterViewInit(): void {
        document.getElementById('preloader').style['display'] = 'none';
    }

    public isUserAuthenticated() {
        const token = localStorage.getItem("jwt");
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          return true;
        }
        else {
          return false;
        }
    }

}
