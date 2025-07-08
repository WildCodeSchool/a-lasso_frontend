import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLogged = authService.getAuthState();

  if (isLogged) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
