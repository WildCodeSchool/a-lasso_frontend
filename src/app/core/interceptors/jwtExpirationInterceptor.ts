import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/features/authentication/services/auth.service';

export const jwtExpirationInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const STATUS_UNAUTHORIZED = 401;

  return next(req).pipe(
    catchError(error => {
      if (error.status === STATUS_UNAUTHORIZED) {
        console.warn('🚨 Merci de vous connecter pour accéder à ce service'); // TODO : change this by Toast once merged

        authService.clearToken();
      }
      return throwError(() => error);
    })
  );
};
