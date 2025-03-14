import { Routes } from '@angular/router';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { ActivityDetailsComponent } from './features/activity/pages/activity-details/activity-details.component';
import { DemoComponent } from './features/activity/pages/demo/demo.component';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesHomeComponent,
  },
  {
    path: 'activity/:id',
    component: ActivityDetailsComponent,
  },
  {
    path: 'demo',
    component: DemoComponent,
  },
  // { path: 'profile',
  //   component: ProfilePage,
  //   canActivate: [isLoggedInGuard]
  //   },
];
