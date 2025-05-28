import { Task } from '../../models/task.model';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
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

  deleteTasks(id: number) {
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
