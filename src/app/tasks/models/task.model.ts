export interface Task {
  id?: number;
  titulo: string;
  descricao: string;
  completado: boolean;
  dataConclusao: string | null;
}
