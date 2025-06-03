import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./tasks/components/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/components/task-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
  },
  {
    path: 'tasks/new',
    loadComponent: () =>
      import('./tasks/components/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./tasks/components/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
