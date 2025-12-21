import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateTaskRequest, Task, UpdateTaskRequest } from '../models/task.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskApi {

  private readonly base = '/api/tasks';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base);
  }

  create(payload: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.base, payload);
  }

  update(id: string, payload: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
