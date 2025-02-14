import { Injectable, inject } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Observable, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivities } from '../store/activities.selector';
import { setActivities, updateFavoriteStatus } from '../store/activities.actions';
import { ActivitiesApiService } from './activities-api.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityFacadeService {
  store: Store = inject(Store);
  activitiesApi: ActivitiesApiService = inject(ActivitiesApiService);
  activities$: Observable<Activity[]> = this.store.select(selectActivities);

  getAllActivities(): void {
    this.activitiesApi
      .getAllActivities()
      .pipe(
        tap((activities: Activity[]) => {
          this.store.dispatch(setActivities({ activities }));
        }),
        take(1)
      )
      .subscribe();
  }

  toggleFavorite(activityId: string, isFavorite: boolean): void {
    // Send to Back
    this.activitiesApi
      .updateFavoriteStatus(activityId, isFavorite)
      .pipe(
        tap((apiResponse: boolean) =>
          apiResponse ? this.store.dispatch(updateFavoriteStatus({ id: activityId, isFavorite: !isFavorite })) : 'TODO : ALERT NOTIFCATION FAILED'
        ),
        take(1)
      )
      .subscribe();

    // if sucess update Store accordignly :
  }
}
