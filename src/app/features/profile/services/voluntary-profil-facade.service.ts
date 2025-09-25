import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { selectActivitiesUserInfos, selectFollowedAssociations } from 'src/app/features/authentication/store/user.selectors';
import { ActivitiesApiService } from '../../activity/services/activities-api.service';
import { Association } from '../../association/models/association.model';
import { selectAssociations } from '../../association/store/association.selectors';

@Injectable({ providedIn: 'root' })
export class VoluntaryProfileFacadeService {
  private _store = inject(Store);
  private _activitiesApi = inject(ActivitiesApiService);

  readonly savedActivities$: Observable<Activity[]> = combineLatest([
    this._store.select(selectActivitiesUserInfos),
    combineLatest([this._activitiesApi.getFutureActivities(), this._activitiesApi.getPastActivities()]).pipe(
      map(([future, past]) => [...future, ...past])
    ),
  ]).pipe(
    map(([userInfos, allActivities]) => {
      const savedIds = userInfos.filter(info => info.isSaved).map(info => info.activityId.toString());
      return allActivities.filter(activity => savedIds.includes(activity.id.toString()));
    })
  );

  readonly followedAssociationsDetails$: Observable<Association[]> = combineLatest([
    this._store.select(selectFollowedAssociations),
    this._store.select(selectAssociations),
  ]).pipe(
    map(([followed, allAssociations]) => {
      const followedIds = followed.map(f => f.associationId.toString());
      return allAssociations.filter(a => followedIds.includes(a.id.toString()));
    })
  );
}
