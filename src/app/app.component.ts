import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Stefanini TODO</span>
    </mat-toolbar>

    <main class="content">
      <router-outlet />
    </main>

    <footer class="footer">
      <mat-button-toggle-group
        [value]="current"
        (change)="navigate($event.value)"
        exclusive
      >
        <mat-button-toggle value="tasks">
          <mat-icon>checklist</mat-icon>
          Tasks
        </mat-button-toggle>

        <mat-button-toggle value="dashboard">
          <mat-icon>bar_chart</mat-icon>
          Dashboard
        </mat-button-toggle>
      </mat-button-toggle-group>
    </footer>
  `,
  styles: [`
    .content {
      padding: 16px;
      min-height: calc(100vh - 128px);
    }

    .footer {
      display: flex;
      justify-content: center;
      padding: 12px;
      border-top: 1px solid rgba(0,0,0,.08);
    }
  `],
})
export class AppComponent {
  current = 'tasks';

  constructor(private router: Router) {}

  navigate(route: string) {
    this.current = route;
    this.router.navigate([route]);
  }
}
