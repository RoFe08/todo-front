import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthApi } from '../../../auth/data/auth.api';
import { AuthSession } from '../../../auth/data/auth.session';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgIf],
  template: `
    <mat-toolbar color="primary" class="toolbar">
    <div class="user" *ngIf="session.user() as u">
        <div class="user-name">Bem vindo {{ u.name || 'Usuário' }}</div>
      </div>

      <span class="spacer"></span>

      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon>
        Sair
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar { position: sticky; top: 0; z-index: 10; }
    .spacer { flex: 1; }
    .title { font-weight: 700; }
    .user {
      margin-right: 12px;
      text-align: right;
      line-height: 1.1;
      opacity: .95;
    }
    .user-name { font-weight: 600; font-size: 13px; }
    .user-email { font-size: 12px; opacity: .85; }
  `],
})
export class AppHeaderComponent {
  private readonly auth = inject(AuthApi);
  private readonly router = inject(Router);
  readonly session = inject(AuthSession);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
