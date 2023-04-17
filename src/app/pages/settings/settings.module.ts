import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactrolesComponent } from './contactroles/contactroles.component';
import { ParametersComponent } from './parameters/parameters.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


export const routes: Routes = [
  { path: '', redirectTo: 'contactroles', pathMatch: 'full'},
  { path: 'contactroles', component: ContactrolesComponent},
  { path: 'parameters', component: ParametersComponent},
  //{ path: 'contacts', component: ContactsComponent, data: { breadcrumb: 'menu.contacts' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule
  ],
    declarations: [
        ContactrolesComponent,
        ParametersComponent
    ],
    exports: [ 
        ContactrolesComponent,
        ParametersComponent
    ]
})

export class SettingsModule { }