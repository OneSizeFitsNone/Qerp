import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientcontactsTabComponent } from './contactroles-tab/clientcontacts-tab.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApptypecontactsComponent } from './apptypecontacts/apptypecontacts.component';
import { MilestonesTabComponent } from './milestones-tab/milestones-tab.component';
import { TasksTabComponent } from './tasks-tab/tasks-tab.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@matheo/datepicker';
import { MatNativeDateModule } from '@matheo/datepicker/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule,
    NgSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ], 
    declarations: [
      ClientcontactsTabComponent,
      ApptypecontactsComponent,
      MilestonesTabComponent,
      TasksTabComponent,
    ],
    exports: [ 
      ClientcontactsTabComponent,
      ApptypecontactsComponent,
      MilestonesTabComponent,
      TasksTabComponent
    ],
    providers: [
      {provide: MAT_DATE_LOCALE, useValue: 'nl-BE'},
    ],
})

export class TabsModule { }