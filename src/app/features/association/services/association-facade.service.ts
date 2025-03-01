import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssociationApiService } from './association-api.service';
import { filter, Observable, of, switchMap, take, tap } from 'rxjs';
import { setAssociations } from '../store/association.actions';
import { Association } from '../model/association.model';
import { selectAssociation } from '../store/association.selector';
import { selectActivityById } from '../../activity/store/activities.selector';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';

@Injectable({
  providedIn: 'root',
})
export class AssociationFacadeService {
  store: Store = inject(Store);
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  associationApiService: AssociationApiService = inject(AssociationApiService);

  getAssociationCard(activityId: string): Observable<Association | null> {
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
  // getAssociationCard(activityId: string): Observable<Association | null> {
  //   // get activity selected from store
  //   const activity$: Observable<Activity | null> = this.store.select(selectActivityById(activityId));
  //   // if no activity found try to fetch it from API (i.e : page has been refreshed)

  //   return activity$.pipe(
  //     switchMap(activity => {
  //       if (!activity) {
  //         console.log('coucou maman 2 ');
  //         this.activityFacadeService.getAllActivities();
  //         activity = this.store.select(selectActivityById(activityId));
  //       }
  //       if (!activity) {
  //         return of(null);
  //       }
  //       // get associationId from activity
  //       const associationId = activity.association.id;

  //       // get association selected from store
  //       return this.store.select(selectAssociation(associationId)).pipe(
  //         switchMap(association => {
  //           if (association) {
  //             return of(association);
  //           }
  //           // if not found in store, request it from API
  //           return this.associationApiService.getAssociationCard(associationId).pipe(
  //             // update store with API response
  //             tap((fetchedAssociation: Association) => {
  //               this.store.dispatch(setAssociations({ association: fetchedAssociation }));
  //             })
  //           );
  //         })
  //       );
  //     })
  //   );
  // }
}
