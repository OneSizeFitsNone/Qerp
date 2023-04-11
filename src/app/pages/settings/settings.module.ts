import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactrolesComponent } from './contactroles/contactroles.component';


export const routes: Routes = [
  { path: '', redirectTo: 'contactroles', pathMatch: 'full'},
  { path: 'contactroles', component: ContactrolesComponent, data: { breadcrumb: 'menu.settings.contactroles' } },
  //{ path: 'contacts', component: ContactsComponent, data: { breadcrumb: 'menu.contacts' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
    declarations: [
        ContactrolesComponent
    ],
    exports: [ 
        ContactrolesComponent
    ]
})

export class SettingsModule { }