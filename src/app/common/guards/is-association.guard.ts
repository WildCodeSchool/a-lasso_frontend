import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserType } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';

export const isAssociationGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthFacade);

  return auth.user$.pipe(
    map(user => {
      if (user && user.type === UserType.Association) {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};
