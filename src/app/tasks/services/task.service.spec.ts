import { TaskService } from './task.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../models/task.model';
import { response } from 'express';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/tasks';

  const mockTasks: Task[] = [
    {
      id: 1,
      titulo: 'Tarefa 1',
      descricao: 'Descrição 1',
      completado: false,
      dataConclusao: '',
    },
    {
      id: 2,
      titulo: 'Tarefa 2',
      descricao: 'Descrição 2',
      completado: true,
      dataConclusao: Date.now().toString(),
    },
  ];

  const mockTask: Task = {
    id: 2,
    titulo: 'Tarefa 2',
    descricao: 'Descrição 2',
    completado: true,
    dataConclusao: Date.now().toString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('#Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Métodos de leitura', () => {
    it('Deve retornar todas as tarefas (#getAllTasks)', () => {
      service.getAllTasks().subscribe((tasks) => {
        expect(tasks).toEqual(mockTasks);
        expect(tasks.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });

    it('Deve retornar uma tarefa por ID (#getTaskById)', () => {
      const taskId = 2;

      service.getTaskById(taskId).subscribe((task) => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTask);
    });

    it('Deve tratar erro 404 no método #getAllTasks', () => {
      service.getAllTasks().subscribe({
        next: () => fail('Deveria ter retornado um erro 404'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush('Erro 404', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Métodos de escrita', () => {
    it('Deve criar uma nova tarefa (#createTask)', () => {
      const newTask: Task = {
        id: 3,
        titulo: 'Tarefa 3',
        descricao: 'Tarefa 3',
        completado: false,
        dataConclusao: '',
      };

      service.createTask(newTask).subscribe((task) => {
        expect(task).toEqual(newTask);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush(newTask);
    });

    it('Deve atualizar uma tarefa existente (#updateTask)', () => {
      const updatedTask: Task = {
        ...mockTask,
        titulo: 'Tarefa atualizada',
      };

      service.updateTask(updatedTask.id, updatedTask).subscribe((task) => {
        expect(task).toEqual(updatedTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${updatedTask.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedTask);
      req.flush(updatedTask);
    });

    it('Deve deletar uma tarefa pelo id (#deleteTask)', () => {
      const taskId = 1;

      service.deleteTask(taskId).subscribe((response) => {
        expect(response).toBeTruthy(); // Só valida que houve resposta, seja {} ou null
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({}); // ou req.flush(null);
    });
  });
});
