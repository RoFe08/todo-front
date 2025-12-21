import { Routes } from '@angular/router';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
  },

  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page.component').then(m => m.TasksPageComponent),
  },

  // sua rota de charts depois
  {
    path: 'charts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
  },

  { path: '**', redirectTo: 'tasks' },
];
