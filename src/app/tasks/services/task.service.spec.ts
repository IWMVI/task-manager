import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';

/**
 * Suite de testes para o serviço TaskService.
 * Esta suite utiliza o HttpClientTestingModule para simular requisições HTTP
 * e garantir que o serviço interage corretamente com a API.
 */
describe('TaskService', () => {
  /**
   * Instância do serviço TaskService a ser testada.
   * @type {TaskService}
   */
  let service: TaskService;
  /**
   * Controlador para simular e verificar requisições HTTP.
   * @type {HttpTestingController}
   */
  let httpMock: HttpTestingController;

  /**
   * URL base da API de tarefas.
   * @type {string}
   */
  const apiUrl = 'http://localhost:3000/api/tasks';

  /**
   * Dados de tarefas simulados para os testes.
   * @type {Task[]}
   */
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

  /**
   * Dados de uma única tarefa simulada para os testes.
   * @type {Task}
   */
  const mockTask: Task = {
    id: 2,
    titulo: 'Tarefa 2',
    descricao: 'Descrição 2',
    completado: true,
    dataConclusao: Date.now().toString(),
  };

  /**
   * Configura o ambiente de teste antes de cada teste.
   * Importa HttpClientTestingModule para simular o módulo HTTP.
   * Fornece o TaskService para injeção de dependência.
   * Injeta o serviço e o HttpTestingController.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /**
   * Verifica se não há requisições HTTP pendentes após cada teste.
   * Garante que todas as requisições simuladas foram manipuladas.
   */
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Testa se o serviço TaskService é criado com sucesso.
   * @returns {void}
   */
  it('#Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Descreve os testes relacionados aos métodos de leitura (GET) do TaskService.
   */
  describe('Métodos de leitura', () => {
    /**
     * Testa se o método `getAllTasks` retorna todas as tarefas corretamente.
     * Espera que o serviço faça uma requisição GET para a `apiUrl`
     * e retorne os `mockTasks`.
     * @returns {void}
     */
    it('Deve retornar todas as tarefas (#getAllTasks)', () => {
      service.getAllTasks().subscribe((tasks) => {
        expect(tasks).toEqual(mockTasks);
        expect(tasks.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });

    /**
     * Testa se o método `getTaskById` retorna uma tarefa específica por ID.
     * Espera que o serviço faça uma requisição GET para `${apiUrl}/${taskId}`
     * e retorne a `mockTask`.
     * @returns {void}
     */
    it('Deve retornar uma tarefa por ID (#getTaskById)', () => {
      const taskId = 2;

      service.getTaskById(taskId).subscribe((task) => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTask);
    });

    /**
     * Testa o tratamento de erro 404 no método `getAllTasks`.
     * Espera que o serviço retorne um erro com status 404 quando a requisição falha.
     * @returns {void}
     */
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

  /**
   * Descreve os testes relacionados aos métodos de escrita (POST, PUT, DELETE) do TaskService.
   */
  describe('Métodos de escrita', () => {
    /**
     * Testa se o método `createTask` cria uma nova tarefa.
     * Espera que o serviço faça uma requisição POST para a `apiUrl`
     * com o corpo da nova tarefa e retorne a tarefa criada.
     * @returns {void}
     */
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

    /**
     * Testa se o método `updateTask` atualiza uma tarefa existente.
     * Espera que o serviço faça uma requisição PUT para `${apiUrl}/${updatedTask.id}`
     * com o corpo da tarefa atualizada e retorne a tarefa atualizada.
     * @returns {void}
     */
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

    /**
     * Testa se o método `deleteTask` deleta uma tarefa pelo ID.
     * Espera que o serviço faça uma requisição DELETE para `${apiUrl}/${taskId}`
     * e retorne uma resposta vazia ou nula.
     * @returns {void}
     */
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
