import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations, updateFollowStatus } from '../store/association.actions';
import { selectAssociation, selectAssociations } from '../store/association.selector';
import { UUIDTypes } from 'uuid';
import { updateFollowedAssociations } from '../../authentication/store/user.actions';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import * as UserSelectors from '../../authentication/store/user.selectors';
import { Association } from '../models/association.model';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  store: Store = inject(Store);
  associationApiService: AssociationApiService = inject(AssociationApiService);

  associations$: Observable<Association[]> = this.store.select(selectAssociations);

  getAssociationCard(associationId: UUIDTypes): Observable<Association> {
    return this._getAssociationFromStore(associationId);
  }

  private _getAssociationFromStore(associationId: UUIDTypes): Observable<Association> {
    return this.store.select(selectAssociation(associationId)).pipe(
      switchMap(association => {
        if (association) {
          return this._patchFollowStatus(association);
        }

        return this.associationApiService.getAssociationCard(associationId).pipe(
          tap(apiAssociation => {
            this.store.dispatch(setAssociations({ association: apiAssociation }));
          }),
          switchMap(apiAssociation => this._patchFollowStatus(apiAssociation))
        );
      })
    );
  }

  private _patchFollowStatus(association: Association): Observable<Association> {
    return this.store.select(UserSelectors.selectFollowedAssociations).pipe(
      take(TAKE_1),
      tap(followedList => {
        const followed = followedList.find(asso => asso.associationId === association.id);
        if (followed && followed.isFollow !== association.isFollow) {
          this.store.dispatch(updateFollowStatus({ id: association.id, isFollow: followed.isFollow }));
        }
      }),
      switchMap(() => of(association))
    );
  }

  toggleFollow(associationId: UUIDTypes, isFollow: boolean): void {
    this.associationApiService
      .updateFollowStatus(associationId, !isFollow)
      .pipe(
        tap((apiResponse: boolean) => {
          this.store.dispatch(updateFollowStatus({ id: associationId, isFollow: apiResponse }));
          this.store.dispatch(updateFollowedAssociations({ associationId, isFollow: apiResponse }));
        }),
        take(TAKE_1)
      )
      .subscribe();
  }
}
