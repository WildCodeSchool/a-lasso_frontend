import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../features/authentication/services/auth.service';

export const isAssociationGuard: CanActivateFn = (): Observable<boolean> => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.isAssociationUser().pipe(
    map(isAsso => {
      if (isAsso) {
        return isAsso;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
