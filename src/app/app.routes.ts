import { Routes } from '@angular/router';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { ActivityDetailsComponent } from './features/activity/pages/activity-details/activity-details.component';
import { activityDetailsResolver } from './common/resolvers/activity-details.resolver';
import { AssociationDetailsComponent } from './features/association/pages/association-details/association-details.component';
import { associationResolver } from './common/resolvers/association.resolver';
import { ActivityCreationComponent } from './features/activity/pages/activity-creation/activity-creation.component';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesHomeComponent,
  },
  { path: 'activivity/creation', component: ActivityCreationComponent },
  {
    path: 'activity/:id',
    component: ActivityDetailsComponent,
    resolve: {
      activityDetails: activityDetailsResolver,
    },
  },
  {
    path: 'association/:id',
    component: AssociationDetailsComponent,
    association: associationResolver,
  },
];
