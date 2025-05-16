import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService as Toast } from 'primeng/api';
import { AuthService } from '../../features/authentication/services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const toast: Toast = inject(Toast);
  const router: Router = inject(Router);
  console.log("req");

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let summary = 'Erreur';
      let detail = 'Une erreur est survenue. Veuillez réessayer.';
      let severity = 'error';

      if (error.status >= HttpStatusCode.InternalServerError) {
        detail = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
      } else if (error.status === HttpStatusCode.NotFound) {
        detail = 'La ressource demandée est introuvable.';
      } else if (error.status === HttpStatusCode.BadRequest) {
        detail = 'Requête invalide.';
      } else if (error.status === HttpStatusCode.Unauthorized) {
        const message = error?.error?.message;
        const isTokenExpired = message === 'Token expired';

        console.log('ici bb');

        if (isTokenExpired) {
          summary = 'Session expirée';
          detail = 'Merci de vous reconnecter.';
          severity = 'warn';

          authService.clearToken();
          authService.clearUserState();
          authService.isLoggedIn();
          router.navigate(['/']);
        } else {
          summary = 'Authentification';
          detail = message || 'Accès non autorisé.';
          severity = 'error';
        }
      }

      toast.add({
        severity,
        summary,
        detail,
      });

      return throwError(() => error);
    })
  );
};
