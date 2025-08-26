import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, switchMap, map } from 'rxjs';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { Association } from 'src/app/features/association/models/association.model';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';
import { ActivityDetailsResolver } from '../models/activity-details-resolver';

export const activityDetailsResolver: ResolveFn<ActivityDetailsResolver> = (route): Observable<ActivityDetailsResolver> => {
  const activityFacadeService = inject(ActivityFacadeService);
  const associationFacadeService = inject(AssociationFacadeService);
  const activityId = route.params['id'];

  return activityFacadeService.getActivityFromStore$(activityId).pipe(
    switchMap((activity: Activity) =>
      associationFacadeService.getAssociationCard(activity.association.id).pipe(
        map((association: Association) => ({
          activity,
          association,
        }))
      )
    )
  );
};
