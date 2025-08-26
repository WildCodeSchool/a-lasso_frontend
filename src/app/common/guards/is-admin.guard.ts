import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../features/authentication/services/auth.service';

export const isAdminGuard: CanActivateFn = (): Observable<boolean> => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.isAdminUser().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return isAdmin;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
