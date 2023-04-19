import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { ProspectComponent } from './prospect/prospect.component';
import { ProjectComponent } from './project/project.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ImageModule } from 'src/app/components/images/image.module';
import {MatTabsModule} from '@angular/material/tabs';
import { CKEditorModule } from 'ng2-ckeditor';
import { TabsModule } from 'src/app/components/tabs/tabs.module';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full'},
  { path: 'prospects', component: ProspectsComponent},
  { path: 'prospect/:id', component: ProspectComponent},
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:id', component: ProjectsComponent },
  { path: 'tasks', component: TasksComponent },
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
    MatCheckboxModule,
    MatDatepickerModule,
    ImageModule,
    MatTabsModule,
    CKEditorModule,
    TabsModule
  ],
    declarations: [
        ProjectsComponent,
        TasksComponent,
        ProspectsComponent,
        ProspectComponent,
        ProjectComponent
    ],
    exports: [ 
    ]
})

export class PMModule { }