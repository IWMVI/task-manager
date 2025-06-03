import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

/**
 * @fileoverview Componente que exibe uma lista de tarefas.
 * @description Este componente é responsável por carregar, filtrar e ordenar tarefas,
 * além de gerenciar a exclusão e a marcação de tarefas como concluídas,
 * interagindo com o `TaskService` e utilizando o `TaskItemComponent` para exibir cada item.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  /**
   * Uma array de objetos `Task` que representa a lista de tarefas carregadas da API.
   * @type {Task[]}
   */
  tasks: Task[] = [];

  /**
   * O estado atual do filtro para as tarefas. Pode ser 'all' (todas), 'completed' (concluídas) ou 'pending' (pendentes).
   * @type {'all' | 'completed' | 'pending'}
   */
  filterStatus: 'all' | 'completed' | 'pending' = 'all';

  /**
   * O critério de ordenação para as tarefas. Pode ser 'createdAt' (data de criação) ou 'completedAt' (data de conclusão).
   * @type {'createdAt' | 'completedAt'}
   */
  sortBy: 'createdAt' | 'completedAt' = 'createdAt';

  /**
   * Cria uma instância de TaskListComponent.
   * @param {TaskService} taskService - O serviço responsável por interagir com a API de tarefas.
   */
  constructor(private taskService: TaskService) {}

  /**
   * Hook do ciclo de vida ngOnInit.
   * Chamado uma vez que o componente é inicializado. Carrega as tarefas.
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Carrega todas as tarefas do serviço `TaskService` e as atribui à propriedade `tasks`.
   * @returns {void}
   */
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  /**
   * Exclui uma tarefa da lista e do backend.
   * Solicita confirmação do usuário antes de proceder com a exclusão.
   * @param {number} id - O ID da tarefa a ser excluída.
   * @returns {void}
   */
  deleteTask(id: number): void {
    if (confirm('Você tem certeza que deseja excluir essa tarefa?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        alert('Tarefa excluída com sucesso!');
      });
    }
  }

  /**
   * Marca uma tarefa específica como concluída.
   * Atualiza o estado da tarefa no backend e no frontend.
   * @param {Task} task - O objeto `Task` a ser marcado como concluído.
   * @returns {void}
   */
  markAsCompleted(task: Task): void {
    const updatedTask = { ...task, completado: true };
    this.taskService.updateTask(task.id!, updatedTask).subscribe(() => {
      task.completado = true; // Atualiza o estado localmente sem recarregar todas as tarefas
      alert('Tarefa marcada como concluída!');
    });
  }

  /**
   * Getter que retorna a lista de tarefas filtradas e ordenadas com base
   * nas propriedades `filterStatus` e `sortBy`.
   * @returns {Task[]} Uma nova array de `Task` contendo as tarefas filtradas e ordenadas.
   */
  get filteredTasks(): Task[] {
    let filtered = [...this.tasks]; // Cria uma cópia para evitar mutação do array original

    // Aplica o filtro de status
    if (this.filterStatus === 'completed') {
      filtered = filtered.filter((task) => task.completado);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter((task) => !task.completado);
    }

    // Aplica a ordenação
    if (this.sortBy === 'createdAt') {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateB - dateA; // Ordena da mais recente para a mais antiga
      });
    } else if (this.sortBy === 'completedAt') {
      filtered = filtered.sort((a, b) => {
        // Se a data de conclusão for nula, assume um valor alto para que tarefas não concluídas
        // sejam exibidas por último quando ordenadas por data de conclusão.
        const dateA = a.dataConclusao
          ? new Date(a.dataConclusao).getTime()
          : Number.MAX_SAFE_INTEGER;
        const dateB = b.dataConclusao
          ? new Date(b.dataConclusao).getTime()
          : Number.MAX_SAFE_INTEGER;
        return dateA - dateB; // Ordena da mais próxima data de conclusão para a mais distante
      });
    }

    return filtered;
  }
}
