import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {

  // Recebe os dados da tarefa do componente pai
  @Input() task!: Task;

  // Eventos para completar e deletar tarefa
  @Output() completeTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  constructor(private router: Router) {}

  // Emite o evento de completar tarefa
  complete() {
    this.completeTask.emit(this.task);
  }

  // Emite o evento de excluir tarefa
  delete() {
    this.deleteTask.emit(this.task.id!);
  }

  // Navega para a rota de edição da tarefa
  edit() {
    this.router.navigate(['/tasks/edit', this.task.id]);
  }
}
