import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientcontactsTabComponent } from './contactroles-tab/clientcontacts-tab.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule,
    NgSelectModule,
    MatFormFieldModule,
    MatSelectModule
  ],
    declarations: [
      ClientcontactsTabComponent
    ],
    exports: [ 
      ClientcontactsTabComponent
    ]
})

export class TabsModule { }