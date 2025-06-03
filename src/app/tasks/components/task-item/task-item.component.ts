import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Router, RouterModule } from '@angular/router';

/**
 * @fileoverview Componente que representa um item individual de tarefa.
 * @description Este componente é responsável por exibir os detalhes de uma única tarefa
 * e emitir eventos para ações como completar ou deletar a tarefa. Ele também
 * permite a navegação para a tela de edição da tarefa.
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  /**
   * Recebe os dados da tarefa do componente pai.
   * @Input
   * @type {Task}
   */
  @Input() task!: Task;

  /**
   * Emite um evento quando a tarefa deve ser marcada como completa ou incompleta.
   * O evento carrega o objeto `Task` atualizado.
   * @Output
   * @type {EventEmitter<Task>}
   */
  @Output() completeTask = new EventEmitter<Task>();

  /**
   * Emite um evento quando a tarefa deve ser deletada.
   * O evento carrega o `id` da tarefa a ser deletada.
   * @Output
   * @type {EventEmitter<number>}
   */
  @Output() deleteTask = new EventEmitter<number>();

  /**
   * Cria uma instância de TaskItemComponent.
   * @param {Router} router - Serviço para navegação entre rotas.
   */
  constructor(private router: Router) {}

  /**
   * Emite o evento `completeTask`, indicando que a tarefa deve ser completada ou incompletada.
   * @returns {void}
   */
  complete(): void {
    this.completeTask.emit(this.task);
  }

  /**
   * Emite o evento `deleteTask`, indicando que a tarefa deve ser excluída.
   * @returns {void}
   */
  delete(): void {
    this.deleteTask.emit(this.task.id!);
  }

  /**
   * Navega para a rota de edição da tarefa, passando o ID da tarefa como parâmetro.
   * @returns {void}
   */
  edit(): void {
    this.router.navigate(['/tasks/edit', this.task.id]);
  }
}
