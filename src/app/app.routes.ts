import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaskFormComponent } from './tasks/components/task-form/task-form.component';
import { TaskListComponent } from './tasks/components/task-list/task-list.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/edit/:id', component: TaskFormComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
