import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full'},
  { path: 'projects', component: ProjectsComponent, data: { breadcrumb: 'menu.projects' } },
  { path: 'tasks', component: TasksComponent, data: { breadcrumb: 'menu.tasks' } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
    declarations: [
        ProjectsComponent,
        TasksComponent
    ],
    exports: [ 
    ]
})

export class PMModule { }