import { Injectable, computed, signal } from '@angular/core';
import { TokenStorage } from './token.storage';
import { decodeJwt, JwtPayload } from '../utils/jwt.utils';

export type SessionUser = {
  userId?: string;
  email?: string;
  name?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly token = signal<string | null>(null);

  constructor(private readonly storage: TokenStorage) {
    this.token.set(this.storage.get());
  }

  // Chame isso depois do login/logout
  sync(): void {
    this.token.set(this.storage.get());
  }

  readonly payload = computed<JwtPayload | null>(() => {
    const t = this.token();
    return t ? decodeJwt(t) : null;
  });

  readonly user = computed<SessionUser | null>(() => {
    const p = this.payload();
    if (!p) return null;

    return {
      userId: p.sub,
      email: typeof p.email === 'string' ? p.email : undefined,
      name: typeof p.name === 'string' ? p.name : undefined,
    };
  });

  readonly displayName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return u.name || u.email || 'Usuário';
  });
}
