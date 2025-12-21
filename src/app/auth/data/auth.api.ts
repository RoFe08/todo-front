import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { TokenStorage } from './token.storage';
import { AuthSession } from './auth.session';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly session = inject(AuthSession);

  private readonly base = '/api/auth';

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/register`, payload);
  }


  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap((res) => {
        this.tokenStorage.set(res.token);
        this.session.sync();
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.session.sync();
  }
}
