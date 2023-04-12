import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientcontactsTabComponent } from './contactroles-tab/clientcontacts-tab.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
    declarations: [
      ClientcontactsTabComponent
    ],
    exports: [ 
      ClientcontactsTabComponent
    ]
})

export class TabsModule { }