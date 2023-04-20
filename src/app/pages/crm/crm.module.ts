import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactComponent } from './contact/contact.component';
import { ImageModule } from 'src/app/components/images/image.module';
import { CompanyComponent } from './company/company.component';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

export const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full'},
  { path: 'companies', component: CompaniesComponent},
  { path: 'contacts', component: ContactsComponent },
  { path: 'company/:id', component: CompanyComponent },
  { path: 'contact/:id', component: ContactComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ImageModule,
    TabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule
  ],
    declarations: [
        ContactsComponent,
        CompaniesComponent,
        ContactComponent,
        CompanyComponent,

    ],
    exports: [ 
        ContactsComponent,
        CompaniesComponent,
        ContactComponent,
        CompanyComponent
    ]
})

export class CRMModule { }