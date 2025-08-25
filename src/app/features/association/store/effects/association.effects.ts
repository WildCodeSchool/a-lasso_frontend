import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, filter, map, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { UserActions } from 'src/app/features/authentication/store/user.actions';
import { AssociationApiService } from '../../services/association-api.service';
import { AssociationActions } from '../association.actions';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { UserSelectors } from 'src/app/features/authentication/store/user.selectors';

const minFollowedAssociationsCount = 0;
const EFFECT_PREFIX = '[AssociationEffects]';

@Injectable()
export class AssociationEffects {
  private _actions$ = inject(Actions);
  private _store = inject(Store);
  private _api = inject(AssociationApiService);
  private _auth = inject(AuthService);

  loadFollowedAssociations$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.loginSuccess),
      switchMap(() => this._auth.isVoluntaryUser()),
      filter(Boolean),
      switchMap(() => this._store.select(UserSelectors.selectFollowedAssociations).pipe(take(TAKE_1))),
      map(followed => followed.map(follow => follow.associationId)),
      filter(ids => ids.length > minFollowedAssociationsCount),

      switchMap(ids =>
        this._api.getAssociationCards(ids).pipe(
          map(associations => AssociationActions.setManyAssociations({ associations })),
          catchError(error => {
            console.error(`${EFFECT_PREFIX} Erreur lors du chargement des associations suivies`, error);
            return EMPTY;
          })
        )
      )
    )
  );
}
