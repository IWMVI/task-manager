import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

/**
 * @fileoverview Componente para o formulário de criação e edição de tarefas.
 * @description Este componente gerencia a lógica para adicionar novas tarefas ou
 * modificar tarefas existentes. Ele utiliza `ReactiveFormsModule` para
 * o gerenciamento do formulário e interage com `TaskService` para
 * operações CRUD de tarefas.
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  /**
   * O formulário reativo para a tarefa.
   * @type {FormGroup}
   */
  form!: FormGroup;

  /**
   * O ID da tarefa, presente apenas quando em modo de edição.
   * @type {number | undefined}
   */
  taskId?: number;

  /**
   * Cria uma instância de TaskFormComponent.
   * @param {FormBuilder} fb - Serviço para construir formulários reativos.
   * @param {TaskService} taskService - Serviço para operações relacionadas a tarefas.
   * @param {Router} router - Serviço para navegação entre rotas.
   * @param {ActivatedRoute} route - Serviço para acessar informações da rota ativa, como parâmetros.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Ciclo de vida ngOnInit.
   * Inicializa o formulário com validações e carrega os dados da tarefa se estiver em modo de edição.
   * @returns {void}
   */
  ngOnInit(): void {
    // Inicializa o formulário com campos e validadores.
    this.form = this.fb.group({
      titulo: ['', Validators.required], // Campo 'titulo' é obrigatório.
      descricao: [''], // Campo 'descricao' opcional.
      dataConclusao: [''], // Campo 'dataConclusao' opcional.
      completado: [false], // Campo 'completado' com valor padrão 'false'.
    });

    // Tenta obter o ID da tarefa da URL para verificar o modo de edição.
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    // Se um taskId for encontrado, significa que estamos em modo de edição.
    if (this.taskId) {
      // Carrega os dados da tarefa existente usando o serviço.
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        // Preenche o formulário com os dados da tarefa carregada.
        this.form.patchValue({
          titulo: task.titulo,
          descricao: task.descricao,
          // Formata a data de conclusão para o formato 'YYYY-MM-DD' para exibição no input de data.
          dataConclusao: task.dataConclusao
            ? task.dataConclusao.split('T')[0]
            : '',
          completado: task.completado,
        });
      });
    }
  }

  /**
   * Manipula o envio do formulário.
   * Valida o formulário, formata a data de conclusão e chama o serviço apropriado
   * para criar ou atualizar a tarefa. Após a operação, exibe um alerta e navega para a lista de tarefas.
   * @returns {void}
   */
  onSubmit(): void {
    // Se o formulário for inválido (por exemplo, campo 'titulo' vazio), a função é encerrada.
    if (this.form.invalid) {
      return;
    }

    // Obtém o valor bruto da data de conclusão do formulário.
    const dataConclusaoRaw = this.form.value.dataConclusao;

    // Converte a data para o formato ISO 8601 ou define como null se não houver data.
    const dataConclusaoISO = dataConclusaoRaw
      ? new Date(dataConclusaoRaw).toISOString()
      : '';

    // Cria um objeto Task com os valores do formulário.
    const task: Task = {
      id: this.taskId!, // O ID é necessário para atualização, '!' garante que é um número.
      titulo: this.form.value.titulo,
      descricao: this.form.value.descricao ?? '', // Usa operador nullish coalescing para garantir string vazia se null/undefined.
      completado: this.form.value.completado ?? false, // Garante false se null/undefined.
      dataConclusao: dataConclusaoISO,
    };

    // Verifica se estamos em modo de edição (taskId existe).
    if (this.taskId) {
      // Chama o serviço para atualizar a tarefa existente.
      this.taskService.updateTask(this.taskId, task).subscribe(() => {
        alert('Tarefa atualizada com sucesso!'); // Exibe um alerta de sucesso.
        this.router.navigate(['/tasks']); // Navega de volta para a lista de tarefas.
      });
    } else {
      // Chama o serviço para criar uma nova tarefa.
      this.taskService.createTask(task).subscribe(() => {
        alert('Tarefa criada com sucesso!'); // Exibe um alerta de sucesso.
        this.router.navigate(['/tasks']); // Navega de volta para a lista de tarefas.
      });
    }
  }
}
