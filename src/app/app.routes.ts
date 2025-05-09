import { Routes } from '@angular/router';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { ActivityDetailsComponent } from './features/activity/pages/activity-details/activity-details.component';
import { activityDetailsResolver } from './common/resolvers/activity-details.resolver';
import { AssociationDetailsComponent } from './features/association/pages/association-details/association-details.component';
import { associationResolver } from './common/resolvers/association.resolver';
import { ActivityCreationComponent } from './features/activity/pages/activity-creation/activity-creation.component';
import { isLoggedInGuard } from './common/guards/is-logged-in.guard';
import { isAssociationGuard } from './common/guards/is-association.guard';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesHomeComponent,
  },
  {
    path: 'activity/creation',
    canActivate: [isLoggedInGuard, isAssociationGuard],
    component: ActivityCreationComponent,
  },
  {
    path: 'activity/:id',
    resolve: {
      activityDetails: activityDetailsResolver,
    },
    component: ActivityDetailsComponent,
  },
  {
    path: 'association/:id',
    component: AssociationDetailsComponent,
    resolve: {
      association: associationResolver,
    },
  },
];
