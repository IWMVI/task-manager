import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Torna este serviço disponível em toda a aplicação
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/api/tasks';

  // Injeta o serviço HttpClient, que permite fazer chamadas HTTP
  constructor(private readonly http: HttpClient) {}

  /**
   * Retorna todas as tarefas do backend
   * @returns Observable com um array de tarefas
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Busca uma tarefa específica pelo ID
   * @param id - ID da tarefa
   * @returns Observable com os dados da tarefa
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria uma nova tarefa no backend
   * @param task - Objeto da tarefa a ser criada
   * @returns Observable com a tarefa criada
   */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Atualiza uma tarefa existente no backend
   * @param id - ID da tarefa
   * @param task - Dados atualizados da tarefa
   * @returns Observable com a tarefa atualizada
   */
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  /**
   * Remove uma tarefa do backend
   * @param id - ID da tarefa
   * @returns Observable sem conteúdo (void)
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
