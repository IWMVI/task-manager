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
    const updatedTask = { ...task, completado: true };
    this.taskService.updateTask(task.id!, updatedTask).subscribe(() => {
      task.completado = true;
      alert('Tarefa marcada como concluída!');
    });
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
    if (this.sortBy === 'createdAt') {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateB - dateA; // Mais recentes primeiro
      });
    } else if (this.sortBy === 'completedAt') {
      filtered = filtered.sort((a, b) => {
        // Se dataConclusao for nula, coloca como valor alto para ir pro fim
        const dateA = a.dataConclusao
          ? new Date(a.dataConclusao).getTime()
          : Number.MAX_SAFE_INTEGER;
        const dateB = b.dataConclusao
          ? new Date(b.dataConclusao).getTime()
          : Number.MAX_SAFE_INTEGER;
        return dateA - dateB; // Data mais próxima primeiro
      });
    }

    return filtered;
  }
}
