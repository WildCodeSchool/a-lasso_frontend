import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'activities',
    component: ActivitiesHomeComponent,
  },
];
