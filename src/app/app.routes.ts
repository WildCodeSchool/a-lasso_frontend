import { Routes } from '@angular/router';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { DemoComponent } from './features/activity/pages/demo/demo.component';

export const routes: Routes = [
  {
    path: '',
    component: ActivitiesHomeComponent,
  },
  {
    path: 'demo',
    component: DemoComponent,
  },
];
