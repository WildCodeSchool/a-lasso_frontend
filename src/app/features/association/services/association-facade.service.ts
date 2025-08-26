import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { UUIDTypes } from 'uuid';
import { Association } from '../models/association.model';
import { ActivitiesUserInfos, FollowedAssociation } from '../../authentication/models/user.model';
import { Image } from '../../activity/models/activity.model';
import { AssociationApiService } from './association-api.service';
import { showInfoToast, showSuccessToast } from 'src/app/common/utils/toast.utils';
import { MessageService } from 'primeng/api';
import { UserActions } from '../../authentication/store/user.actions';
import { AssociationSelectors } from '../store/association.selectors';
import { UserSelectors } from '../../authentication/store/user.selectors';
import { AssociationActions } from '../store/association.actions';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  private _store: Store = inject(Store);
  private _toast: MessageService = inject(MessageService);
  private _associationApiService: AssociationApiService = inject(AssociationApiService);

  associations$: Observable<Association[]> = this._store.select(AssociationSelectors.selectAssociations);
  associationId$: Observable<UUIDTypes> = this._store.select(UserSelectors.selectConnectedAssociationId);

  getAssociationCard(associationId: UUIDTypes): Observable<Association> {
    return this._getAssociationFromStore(associationId);
  }

  private _getAssociationFromStore(associationId: UUIDTypes): Observable<Association> {
    return this._store.select(AssociationSelectors.selectAssociation(associationId)).pipe(
      switchMap(association => {
        if (association) {
          return this._patchFollowStatus(association);
        }

        return this._associationApiService.getAssociationCard(associationId).pipe(
          tap(apiAssociation => {
            this._store.dispatch(AssociationActions.setAssociations({ association: apiAssociation }));
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
    return this._store.select(UserSelectors.selectActivitiesUserInfos).pipe(
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
          this._store.dispatch(UserActions.updateFollowedAssociations({ associationId, isFollow: apiResponse }));

          if (apiResponse === true) {
            showSuccessToast(this._toast);
          } else {
            showInfoToast(this._toast, 'Association retirée de vos suivis.');
          }
        }),
        take(TAKE_1)
      )
      .subscribe();
  }
}
