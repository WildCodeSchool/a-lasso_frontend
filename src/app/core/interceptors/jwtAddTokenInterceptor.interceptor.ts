import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/authentication/services/auth.service';
import { inject } from '@angular/core';

export const jwtAddTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  console.log('[Interceptor] Token:', token);
  if (!token) {
    return next(req);
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const newReq = req.clone({
    headers,
  });

  return next(newReq);
};
