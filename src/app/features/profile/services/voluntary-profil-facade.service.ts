import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { selectActivities } from 'src/app/features/activity/store/activities.selectors';
import { selectActivitiesUserInfos, selectFollowedAssociations } from 'src/app/features/authentication/store/user.selectors';
import { Association } from '../../association/models/association.model';
import { selectAssociations } from '../../association/store/association.selectors';

@Injectable({ providedIn: 'root' })
export class VoluntaryProfileFacadeService {
  private _store = inject(Store);

  readonly savedActivities$: Observable<Activity[]> = combineLatest([
    this._store.select(selectActivities),
    this._store.select(selectActivitiesUserInfos),
  ]).pipe(
    map(([activities, userInfos]) => {
      const savedIds = userInfos.filter(info => info.isSaved).map(info => info.activityId.toString());

      return activities.filter(activity => savedIds.includes(activity.id.toString()));
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
