import { TaskStatus } from './task.models';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em progresso',
  DONE: 'Concluído',
};

export const TASK_STATUS_CLASS: Record<TaskStatus, string> = {
  PENDING: 'chip-pendente',
  IN_PROGRESS: 'chip-progresso',
  DONE: 'chip-concluido',
};
