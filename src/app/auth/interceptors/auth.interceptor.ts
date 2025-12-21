import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../data/token.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).get();

  // Não injeta token no /api/auth
  const isApi = req.url.startsWith('/api/');
  const isAuth = req.url.startsWith('/api/auth/');
  if (!isApi || isAuth || !token) return next(req);

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
