import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChip, MatChipsModule } from '@angular/material/chips';

import { TaskApi } from '../../data/task.api';
import { Task, TaskStatus } from '../../models/task.models';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskEditDialogComponent } from '../../dialogs/task-edit-dialog/task-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { TASK_STATUS_CLASS, TASK_STATUS_LABEL } from '../../models/task-status.ui';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    TaskFormComponent
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(6px)' })),
      ]),
    ]),
  ],
})
export class TasksPageComponent {
  private readonly api = inject(TaskApi);
  private readonly dialog = inject(MatDialog);

  // options para o filtro (tipado, sem any no HTML)
  readonly STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

  // state
  readonly loading = signal(false);
  readonly tasks = signal<Task[]>([]);
  readonly statusFilter = signal<TaskStatus | 'ALL'>('ALL');

  // derived state
  readonly filteredTasks = computed(() => {
    const filter = this.statusFilter();
    const list = this.tasks();
    return filter === 'ALL' ? list : list.filter(t => t.status === filter);
  });

  readonly totalCount = computed(() => this.filteredTasks().length);

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.tasks.set(data ?? []),
      });
  }

  onCreated(): void {
    this.refresh();
  }

  setFilter(status: TaskStatus | 'ALL'): void {
    this.statusFilter.set(status);
  }

  openEdit(task: Task): void {
    const ref = this.dialog.open(TaskEditDialogComponent, {
      width: '520px',
      data: task,
    });

    ref.afterClosed().subscribe((changed: boolean) => {
      if (changed) this.refresh();
    });
  }

  confirmDelete(task: Task): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Excluir tarefa',
        message: `Tem certeza que deseja excluir "${task.title}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.loading.set(true);
      this.api.delete(task.id)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({ next: () => this.refresh() });
    });
  }

  statusLabel(status: TaskStatus): string {
    return TASK_STATUS_LABEL[status];
  }

  statusClass(status: TaskStatus): string {
    return TASK_STATUS_CLASS[status];
  }
}
