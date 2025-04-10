import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations, updateFollowStatus } from '../store/association.actions';
import { Association } from '../model/association.model';
import { selectAssociation, selectAssociations } from '../store/association.selector';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';
import { UUIDTypes } from 'uuid';
import { Activity } from '../../activity/models/activity.model';

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
          return of(association);
        }
        return this.associationApiService.getAssociationCard(associationId).pipe(
          tap((fetchedAssociation: Association) => {
            this.store.dispatch(setAssociations({ association: fetchedAssociation }));
          })
        );
      })
    );
  }

  toggleFollow(associationId: UUIDTypes, isFollow: boolean): void {
    this.associationApiService
      .updateFollowStatus(associationId, !isFollow)
      .pipe(
        tap((apiResponse: boolean) =>
          this.store.dispatch(
            updateFollowStatus({
              id: associationId,
              isFollow: apiResponse,
            })
          )
        ),
        take(1)
      )
      .subscribe();
  }
}
