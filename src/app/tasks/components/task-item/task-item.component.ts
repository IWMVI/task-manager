import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<number>();
  @Output() complete = new EventEmitter<Task>();

  onDelete() {
    this.delete.emit(this.task.id);
  }

  onComplete() {
    this.complete.emit(this.task);
  }
}
