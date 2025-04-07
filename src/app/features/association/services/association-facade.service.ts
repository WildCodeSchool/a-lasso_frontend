import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations, updateFollowStatus } from '../store/association.actions';
import { Association } from '../model/association.model';
import { selectAssociation } from '../store/association.selector';
import { selectActivityById } from '../../activity/store/activities.selector';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  store: Store = inject(Store);
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  associationApiService: AssociationApiService = inject(AssociationApiService);

  getAssociationCard(activityId: UUIDTypes): Observable<Association | null> {
    // get activity selected from store
    return this.store.select(selectActivityById(activityId)).pipe(
      switchMap(activity => {
        if (activity) {
          // get association selected from store
          return this._getAssociation(activity.association.id);
        }

        // if no activity found try to fetch it from API (i.e : page has been refreshed)
        this.activityFacadeService.getAllActivities();

        // then get activity before getting association
        return this.store.select(selectActivityById(activityId)).pipe(
          filter(activity => !!activity), // to prevent initial empty store on init to stop the flow
          take(1), // stop to listen once store is filled with an activity
          switchMap(activity => this._getAssociation(activity!.association.id))
        );
      })
    );
  }

  private _getAssociation(associationId: string): Observable<Association | null> {
    return this.store.select(selectAssociation(associationId)).pipe(
      switchMap(association => {
        if (association) {
          return of(association);
        }
        // If not found in store, fetch from API
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
        tap((apiResponse: boolean) => this.store.dispatch(updateFollowStatus({ id: associationId, isFollow: apiResponse }))),
        take(1)
      )
      .subscribe();
  }
}
