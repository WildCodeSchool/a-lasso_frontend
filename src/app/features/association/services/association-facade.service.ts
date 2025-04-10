import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations, updateFollowStatus } from '../store/association.actions';
import { selectAssociation, selectAssociations } from '../store/association.selector';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';
import { UUIDTypes } from 'uuid';
import { Activity } from '../../activity/models/activity.model';
import { updateFollowedAssociations } from '../../authentication/store/user.actions';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import * as UserSelectors from '../../authentication/store/user.selectors';
import { Association } from '../models/association.model';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  store: Store = inject(Store);
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  associationApiService: AssociationApiService = inject(AssociationApiService);

  associations$: Observable<Association[]> = this.store.select(selectAssociations);

  getAssociationCard(activityId: UUIDTypes): Observable<Association> {
    return this.activityFacadeService.getActivityFromStore$(activityId).pipe(
      tap(activity => {
        if (!activity) {
          this.activityFacadeService.getAllActivitiesFromApi();
        }
      }),
      filter((activity): activity is Activity => !!activity),
      switchMap((activity: Activity) => this._getAssociationFromStore(activity.association.id))
    );
  }

  private _getAssociationFromStore(associationId: string): Observable<Association> {
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
