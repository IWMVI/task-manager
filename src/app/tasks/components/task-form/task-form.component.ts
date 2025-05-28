import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  form!: FormGroup;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      completado: [false],
    });

    // Verifica se há um ID na rota (edição)
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.form.patchValue({
          titulo: task.titulo,
          descricao: task.descricao,
          completado: task.completado,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    // Monta o objeto Task, tratando dataConclusao
    const task: Task = {
      titulo: this.form.value.titulo!,
      descricao: this.form.value.descricao ?? '',
      completado: this.form.value.completado ?? false,
      dataConclusao: this.form.value.completado ? new Date().toISOString() : null,
      id: this.taskId, // Inclui id se for edição (backend pode ignorar ou usar)
    };

    if (this.taskId) {
      // Atualiza tarefa existente
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
