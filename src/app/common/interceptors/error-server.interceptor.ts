import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService as Toast } from 'primeng/api';
import { AuthService } from '../../features/authentication/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const toast: Toast = inject(Toast);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const summary = 'Erreur';
      let detail = 'Une erreur est survenue. Veuillez réessayer.';

      if (error.error?.message) {
        detail = error.error.message;
      } else if (error.status >= HttpStatusCode.InternalServerError) {
        detail = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
      } else if (error.status === HttpStatusCode.NotFound) {
        detail = 'La ressource demandée est introuvable.';
      } else if (error.status === HttpStatusCode.BadRequest) {
        detail = 'Requête invalide.';
      } else if (error.status === HttpStatusCode.Unauthorized) {
        detail = '🚨 Merci de vous connecter pour accéder à ce service';
        authService.clearToken();
      }

      toast.add({
        severity: 'error',
        summary,
        detail,
      });

      return throwError(() => error);
    })
  );
};
