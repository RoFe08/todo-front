import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { finalize } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.models';
import { TaskApi } from '../../data/task.api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,],
  templateUrl: './task-edit-dialog.component.html',
})
export class TaskEditDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TaskApi);
  private readonly ref = inject(MatDialogRef<TaskEditDialogComponent>);
  private readonly snack = inject(MatSnackBar);

  readonly saving = signal(false);


  form = new FormGroup<any>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null),
    status: new FormControl<TaskStatus>('PENDING', { nonNullable: true }),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) {
    this.form.patchValue({
      title: data.title,
      description: data.description ?? '',
      status: data.status,
    });
  }

  close(): void {
    this.ref.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.api.update(this.data.id, this.form.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.snack.open('Tarefa atualizada ✨', 'OK', { duration: 2000 });
          this.ref.close(true);
        },
      });
  }
}
