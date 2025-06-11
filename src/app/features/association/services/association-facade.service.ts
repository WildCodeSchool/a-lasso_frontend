import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations } from '../store/association.actions';
import { selectAssociation, selectAssociations } from '../store/association.selector';
import { UUIDTypes } from 'uuid';
import { updateFollowedAssociations } from '../../authentication/store/user.actions';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import * as UserSelectors from '../../authentication/store/user.selectors';
import { Association } from '../models/association.model';
import { selectActivitiesUserInfos } from '../../authentication/store/user.selectors';
import { ActivitiesUserInfos, FollowedAssociation } from '../../authentication/models/user.model';
import { Image } from '../../activity/models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  private _store: Store = inject(Store);
  private _associationApiService: AssociationApiService = inject(AssociationApiService);

  associations$: Observable<Association[]> = this._store.select(selectAssociations);

  getAssociationCard(associationId: UUIDTypes): Observable<Association> {
    return this._getAssociationFromStore(associationId);
  }

  private _getAssociationFromStore(associationId: UUIDTypes): Observable<Association> {
    return this._store.select(selectAssociation(associationId)).pipe(
      switchMap(association => {
        if (association) {
          return this._patchFollowStatus(association);
        }

        return this._associationApiService.getAssociationCard(associationId).pipe(
          tap(apiAssociation => {
            this._store.dispatch(setAssociations({ association: apiAssociation }));
          }),
          switchMap(apiAssociation => this._patchFollowStatus(apiAssociation))
        );
      })
    );
  }

  private _patchFollowStatus(association: Association): Observable<Association> {
    return this._store.select(UserSelectors.selectFollowedAssociations).pipe(
      take(TAKE_1),
      switchMap(() => of(association))
    );
  }

  getIsFollowAssociation(associationId: UUIDTypes): Observable<boolean> {
    return this._store.select(UserSelectors.selectFollowedAssociations).pipe(
      switchMap((followedAssociations: FollowedAssociation[]): Observable<boolean> => {
        const followedAsso = followedAssociations.find(asso => asso.associationId === associationId);
        if (!followedAsso) {
          return of(false);
        }
        return of(followedAsso.isFollow);
      })
    );
  }

  getIsSavedActivity(activityId: UUIDTypes): Observable<boolean> {
    return this._store.select(selectActivitiesUserInfos).pipe(
      switchMap((userActivityInfos: ActivitiesUserInfos[]): Observable<boolean> => {
        const activityInfos = userActivityInfos.find(activity => activity.activityId === activityId);
        if (!activityInfos) {
          return of(false);
        }
        return of(activityInfos.isSaved);
      })
    );
  }

  getExistingActivityPictures(currentOffset: number, pageSize: number): Observable<Image[]> {
    return this._associationApiService.getExistingActivityPictures(currentOffset, pageSize);
  }

  toggleFollow(associationId: UUIDTypes, isFollow: boolean): void {
    this._associationApiService
      .updateFollowStatus(associationId, isFollow)
      .pipe(
        tap((apiResponse: boolean) => {
          this._store.dispatch(updateFollowedAssociations({ associationId, isFollow: apiResponse }));
        }),
        take(TAKE_1)
      )
      .subscribe();
  }
}
