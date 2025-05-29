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

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  // Formulário da tarefa
  form!: FormGroup;

  // ID da tarefa, usado na edição
  taskId?: number;
  task: any;

  constructor(
    private fb: FormBuilder, // Para criar o formulário
    private taskService: TaskService, // Serviço de tarefas (API)
    private router: Router, // Para navegação
    private route: ActivatedRoute // Para pegar parâmetros da rota
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário com validações
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      dataConclusao: [''],
      completado: [false],
    });

    // Verifica se há um ID na URL (modo edição)
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      // Carrega a tarefa para edição
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.form.patchValue({
          titulo: task.titulo,
          descricao: task.descricao,
          dataConclusao: task.dataConclusao
            ? task.dataConclusao.split('T')[0]
            : '',
          completado: task.completado,
        });
      });
    }
  }

  // Envia o formulário
  onSubmit() {
    if (this.form.invalid) return;

    const dataConclusaoRaw = this.form.value.dataConclusao;
    const dataConclusaoISO = dataConclusaoRaw
      ? new Date(dataConclusaoRaw).toISOString()
      : null;

    const task: Task = {
      titulo: this.form.value.titulo!,
      descricao: this.form.value.descricao ?? '',
      completado: this.form.value.completado ?? false,
      dataConclusao: this.form.value.completado
        ? new Date().toISOString()
        : null,
      id: this.taskId,
      createdAt: this.task?.createdAt ?? new Date().toISOString(), // <-- aqui mantém ou cria
    };

    if (this.taskId) {
      // Atualiza tarefa
      this.taskService.updateTask(this.taskId, task).subscribe(() => {
        alert('Tarefa atualizada com sucesso!');
        this.router.navigate(['/tasks']);
      });
    } else {
      // Cria nova tarefa
      this.taskService.createTask(task).subscribe(() => {
        alert('Tarefa criada com sucesso!');
        this.router.navigate(['/tasks']);
      });
    }
  }
}
