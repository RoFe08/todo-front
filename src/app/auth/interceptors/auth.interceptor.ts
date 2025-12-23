import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../data/token.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).get();
  if (!token) return next(req);

  const url = new URL(req.url, window.location.origin);
  const path = url.pathname;

  const isApi = path.startsWith('/api/');
  const isAuth = path.startsWith('/api/auth/');

  if (!isApi || isAuth) return next(req);
  console.log('REQ', req.url, 'TOKEN?', !!token);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
