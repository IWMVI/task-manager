export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  completado: boolean;
  dataConclusao: string;
  createdAt?: string;
  updatedAt?: string;
}
