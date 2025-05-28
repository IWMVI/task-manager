import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskItemComponent } from './components/task-item/task-item.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TaskFormComponent,
    TaskListComponent,
    TaskItemComponent,
  ],
  exports: [
    TaskFormComponent,
    TaskListComponent,
    TaskItemComponent,
  ],
})
export class TasksModule {}
