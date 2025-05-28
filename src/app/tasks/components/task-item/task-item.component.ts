import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() task!: Task;

  @Output() completeTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  complete() {
    this.completeTask.emit(this.task);
  }

  delete() {
    this.deleteTask.emit(this.task.id!);
  }
}
