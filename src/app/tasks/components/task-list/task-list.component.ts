import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  deleteTask(id: number) {
    if (confirm('Você tem certeza que deseja excluir essa tarefa?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        alert('Tarefa excluída com sucesso!');
      });
    }
  }

  markAsCompleted(task: Task) {
    const updatedTask = { ...task, completado: true };
    this.taskService.updateTask(task.id!, updatedTask).subscribe(() => {
      task.completado = true;
      alert('Tarefa marcada como concluída!');
    });
  }
}
