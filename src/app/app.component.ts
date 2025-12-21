import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthApi } from './auth/data/auth.api';
import { AuthSession } from './auth/data/auth.session';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <!-- Top bar só quando logado -->
    <mat-toolbar class="header" *ngIf="showShell()">
      <span class="spacer"></span>

      <div class="user" *ngIf="session.user() as u">
        <div class="user-name">Bem vindo - {{ u.name || 'Usuário' }}</div>
      </div>

      <button style="color: white;" mat-button (click)="logout()">
        <mat-icon >logout</mat-icon>
        Sair
      </button>
    </mat-toolbar>

    <main class="content" [class.content--no-shell]="!showShell()">
      <router-outlet />
    </main>

    <!-- Footer (toggle) só quando logado -->
    <footer class="footer" *ngIf="showShell()">
      <mat-button-toggle-group
        [value]="current"
        (change)="navigate($event.value)"
        exclusive
      >
        <mat-button-toggle value="tasks">
          <mat-icon>checklist</mat-icon>
          Tasks
        </mat-button-toggle>

        <mat-button-toggle value="charts">
          <mat-icon>bar_chart</mat-icon>
          Dashboard
        </mat-button-toggle>
      </mat-button-toggle-group>
    </footer>
  `,
  styles: [`
    .header{
      background: none
    }
    .content {
      padding: 16px;
      min-height: calc(100vh - 128px);
    }

    .content--no-shell {
      min-height: 100vh;
    }

    .footer {
      display: flex;
      justify-content: center;
      padding: 12px;
      background: none !important;
      position: sticky;
      bottom: 0;
      background: white;
    }

    .spacer { flex: 1; }

    .user {
      margin-right: 12px;
      text-align: right;
      line-height: 1.1;
      opacity: .95;
    }
    .user-name { font-weight: 600; font-size: 13px; color: #fff; }
    button{
      color: #fff; 
    }
  `],
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthApi);
  readonly session = inject(AuthSession);

  // controla o toggle selecionado
  current = 'tasks';

  // mostra header/footer apenas se estiver logado
  readonly showShell = computed(() => !!this.session.user());

  constructor() {
    // mantém current sincronizado com a rota
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        const url = this.router.url;
        if (url.startsWith('/charts')) this.current = 'charts';
        else if (url.startsWith('/tasks')) this.current = 'tasks';
      });
  }

  navigate(route: string) {
    this.current = route;
    this.router.navigate(['/' + route]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
