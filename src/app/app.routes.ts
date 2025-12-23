import { Routes } from '@angular/router';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },

  {
    path: 'login',
    data: { animKey: 'login' },
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'register',
    data: { animKey: 'register' },
    loadComponent: () =>
      import('./auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
  },

  {
    path: 'tasks',
    data: { animKey: 'tasks' },
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page.component').then(m => m.TasksPageComponent),
  },

  {
    path: 'dashboard',
    data: { animKey: 'dashboard' },
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
  },

  { path: '**', redirectTo: 'tasks' },
];
