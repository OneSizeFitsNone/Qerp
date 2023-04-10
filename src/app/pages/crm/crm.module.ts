import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactComponent } from './contact/contact.component';
import { ImageThumbnailComponent } from 'src/app/components/images/image-thumbnail/image-thumbnail.component';
import { ImageDisplayComponent } from 'src/app/components/images/image-display/image-display.component';
import { ImageEditComponent } from 'src/app/components/images/image-edit/image-edit.component';
import { AppModule } from 'src/app/app.module';
import { ImageModule } from 'src/app/components/images/image.module';

export const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full'},
  { path: 'companies', component: CompaniesComponent, data: { breadcrumb: 'menu.companies' } },
  { path: 'contacts', component: ContactsComponent, data: { breadcrumb: 'menu.contacts' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ImageModule
  ],
    declarations: [
        ContactsComponent,
        CompaniesComponent,
        ContactComponent,

    ],
    exports: [ 
        ContactsComponent,
        CompaniesComponent
    ]
})

export class CRMModule { }