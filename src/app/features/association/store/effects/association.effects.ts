import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { loginSuccess } from 'src/app/features/authentication/store/user.actions';
import { selectFollowedAssociations } from 'src/app/features/authentication/store/user.selectors';
import { AssociationApiService } from '../../services/association-api.service';
import { setManyAssociations } from '../association.actions';

@Injectable()
export class AssociationEffects {
  private _actions$ = inject(Actions);
  private _store = inject(Store);
  private _api = inject(AssociationApiService);
  private _authService = inject(AuthService);

  loadFollowedAssociations$ = createEffect(() =>
    this._actions$.pipe(
      ofType(loginSuccess),
      switchMap(() =>
        this._authService.isVoluntaryUser().pipe(
          switchMap(isVoluntary => {
            if (!isVoluntary) {
              return of();
            }
            return this._store.select(selectFollowedAssociations).pipe(
              switchMap(followed => {
                const ids = followed.map(f => f.associationId);
                if (!ids.length) return of();

                return this._api.getAssociationCards(ids).pipe(
                  map(associations => setManyAssociations({ associations })),
                  catchError(error => {
                    console.error('Erreur lors du chargement des associations suivies', error);
                    return of();
                  })
                );
              })
            );
          })
        )
      )
    )
  );
}
