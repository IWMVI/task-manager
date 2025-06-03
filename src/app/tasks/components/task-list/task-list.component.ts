import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TaskItemComponent,
    DatePipe,
  ],
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
   * O critério de ordenação para as tarefas. As opções incluem:
   * - 'oldestCreated': Tarefas mais antigas primeiro (pela data de criação).
   * - 'newestCreated': Tarefas mais recentes primeiro (pela data de criação).
   * - 'closesDue': Tarefas com data de conclusão mais próxima primeiro.
   * - 'farthestDue': Tarefas com data de conclusão mais distante primeiro.
   * @type {'oldestCreated' | 'newestCreated' | 'closesDue' | 'farthestDue'}
   */
  sortBy: 'oldestCreated' | 'newestCreated' | 'closesDue' | 'farthestDue' =
    'newestCreated';

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
   * Converte uma string de data do formato `DD/MM/YYYY` para um objeto `Date`.
   * Retorna `null` se a data for inválida ou não fornecida.
   * @param {string | null | undefined} dateString - A string de data no formato `DD/MM/YYYY`.
   * @returns {Date | null} O objeto Date correspondente ou `null`.
   */
  private parseDateString(dateString: string | null | undefined): Date | null {
    if (!dateString) {
      return null;
    }
    // Supondo que a dataConclusao pode vir como "DD/MM/YYYY" ou "YYYY-MM-DD"
    // Se for "DD/MM/YYYY", converte para "YYYY-MM-DD" para parser consistente
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // É provável que seja DD/MM/YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexed
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    }

    // Tenta parsear como ISO 8601 ou outro formato reconhecido nativamente
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  /**
   * Carrega todas as tarefas do serviço `TaskService` e as atribui à propriedade `tasks`.
   * @returns {void}
   */
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      // Opcional: pré-processar as datas aqui se você quiser que elas sempre sejam Date objects
      // mas o getter filteredTasks já faz o parse para a ordenação.
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
    switch (this.sortBy) {
      case 'oldestCreated':
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt!).getTime();
          const dateB = new Date(b.createdAt!).getTime();
          return dateA - dateB; // Mais antigos primeiro (ordem crescente)
        });
        break;
      case 'newestCreated':
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt!).getTime();
          const dateB = new Date(b.createdAt!).getTime();
          return dateB - dateA; // Mais recentes primeiro (ordem decrescente)
        });
        break;
      case 'closesDue':
        filtered = filtered.sort((a, b) => {
          // Usa a nova função parseDateString para garantir que a data seja interpretada corretamente
          const dateATime = this.parseDateString(a.dataConclusao)?.getTime();
          const dateBTime = this.parseDateString(b.dataConclusao)?.getTime();

          // Trata datas nulas ou inválidas, colocando-as no final da lista
          const finalDateA =
            dateATime && !isNaN(dateATime)
              ? dateATime
              : Number.MAX_SAFE_INTEGER;
          const finalDateB =
            dateBTime && !isNaN(dateBTime)
              ? dateBTime
              : Number.MAX_SAFE_INTEGER;

          console.log(
            `[closesDue] Comparing "${a.titulo}" (${a.dataConclusao} -> ${finalDateA}) with "${b.titulo}" (${b.dataConclusao} -> ${finalDateB})`
          );

          return finalDateA - finalDateB; // Conclusão mais próxima primeiro (ordem crescente)
        });
        break;
      case 'farthestDue':
        filtered = filtered.sort((a, b) => {
          // Usa a nova função parseDateString para garantir que a data seja interpretada corretamente
          const dateATime = this.parseDateString(a.dataConclusao)?.getTime();
          const dateBTime = this.parseDateString(b.dataConclusao)?.getTime();

          // Trata datas nulas ou inválidas, colocando-as no final da lista
          const finalDateA =
            dateATime && !isNaN(dateATime)
              ? dateATime
              : Number.MAX_SAFE_INTEGER;
          const finalDateB =
            dateBTime && !isNaN(dateBTime)
              ? dateBTime
              : Number.MAX_SAFE_INTEGER;

          console.log(
            `[farthestDue] Comparing "${a.titulo}" (${a.dataConclusao} -> ${finalDateA}) with "${b.titulo}" (${b.dataConclusao} -> ${finalDateB})`
          );

          return finalDateB - finalDateA; // Conclusão mais distante primeiro (ordem decrescente)
        });
        break;
    }

    return filtered;
  }
}
