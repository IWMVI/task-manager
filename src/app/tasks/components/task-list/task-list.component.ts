import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []; // Lista de tarefas carregadas da API

  // Estado atual do filtro e ordenação
  filterStatus: 'all' | 'completed' | 'pending' = 'all';
  sortBy: 'createdAt' | 'completedAt' = 'createdAt';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Carrega todas as tarefas da API
  loadTasks() {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  // Exclui uma tarefa
  deleteTask(id: number) {
    if (confirm('Você tem certeza que deseja excluir essa tarefa?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        alert('Tarefa excluída com sucesso!');
      });
    }
  }

  // Marca uma tarefa como concluída
  markAsCompleted(task: Task) {
    const updatedTask: Task = {
      ...task,
      completado: true,
      dataConclusao: new Date().toISOString(),
      createdAt: task.createdAt, // <-- mantém a data original
    };
  }

  // Aplica filtro e ordenação nas tarefas
  get filteredTasks(): Task[] {
    let filtered = [...this.tasks];

    // Filtro por status
    if (this.filterStatus === 'completed') {
      filtered = filtered.filter((task) => task.completado);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter((task) => !task.completado);
    }

    // Ordenação
    filtered = filtered.sort((a, b) => {
      const dataConclusaoA = a.dataConclusao
        ? new Date(a.dataConclusao).getTime()
        : Infinity;
      const dataConclusaoB = b.dataConclusao
        ? new Date(b.dataConclusao).getTime()
        : Infinity;

      // Primeiro: ordenar pela data de conclusão mais próxima
      if (dataConclusaoA !== dataConclusaoB) {
        return dataConclusaoA - dataConclusaoB;
      }

      // Se empatou na data de conclusão, ordenar pela data de criação (mais antigos no topo)
      const createdAtA = new Date(a.createdAt!).getTime();
      const createdAtB = new Date(b.createdAt!).getTime();
      return createdAtA - createdAtB;
    });

    return filtered;
  }
}
