import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { LoginService } from 'src/app/services/user/login.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'az-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})

export class LoginComponent {  
    public router: Router;
    public form: FormGroup;
    public loginService: LoginService;
    public username: AbstractControl;
    public password: AbstractControl;
    public translate: TranslateService;


    constructor(
        router: Router, 
        fb: FormBuilder,
        loginService: LoginService
    ) {
        this.router = router;
        this.form = fb.group({
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.loginService = loginService;
        this.username = this.form.controls['username'];
        this.password = this.form.controls['password'];
    }

    public onSubmit(values:Object):void {
        if (this.form.valid) {
            console.log(values);
            this.loginService.login(this.username.value, this.password.value)
            //this.router.navigate(['pages/dashboard']);
        }
    }

    public setLanguage(lang: string) {
        this.loginService.setLanguage(lang);
    }
}

export function emailValidator(control: FormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
}
