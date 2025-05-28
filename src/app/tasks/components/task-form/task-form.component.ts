import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
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
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      dataConclusao: ['', Validators.required],
      completado: [false],
    });

    this.taskId = this.route.snapshot.params['id'];
    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.form.patchValue(task);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const task: Task = this.form.value;

    if (this.taskId) {
      this.taskService.updateTask(this.taskId, task).subscribe(() => {
        alert('Task updated successfully!');
        this.router.navigate(['/list']);
      });
    } else {
      this.taskService.createTask(task).subscribe(() => {
        alert('Task created successfully!');
        this.router.navigate(['/list']);
      });
    }
  }
}
