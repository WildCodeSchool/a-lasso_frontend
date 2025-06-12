import { Routes } from '@angular/router';
import { isAssociationGuard } from './common/guards/is-association.guard';
import { isLoggedInGuard } from './common/guards/is-logged-in.guard';
import { activityDetailsResolver } from './common/resolvers/activity-details.resolver';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { ActivityDetailsComponent } from './features/activity/pages/activity-details/activity-details.component';
import { AssociationDetailsComponent } from './features/association/pages/association-details/association-details.component';
import { associationResolver } from './common/resolvers/association.resolver';
import { ActivityCreationComponent } from './features/activity/pages/activity-creation/activity-creation.component';
import { ReportHomePageComponent } from './features/report/pages/report-home-page/report-home-page.component';
import { reportsResolver } from './common/resolvers/reports.resolver';
import { AssociationProfilePageComponent } from './features/profile/pages/association-profile-page/association-profile-page.component';

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
    path: 'reports',
    component: ReportHomePageComponent,
    resolve: {
      reports: reportsResolver,
    },
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
  {
    path: 'profile/association',
    component: AssociationProfilePageComponent,
    canActivate: [isLoggedInGuard, isAssociationGuard],
    children: [
      {
        path: 'activities',
        loadComponent: () => import('./features/profile/components/activity-menu/activity-menu.component').then(m => m.ActivityMenuComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/components/association-about/association-about.component').then(m => m.AssociationAboutComponent),
      },
      {
        path: 'security',
        loadComponent: () => import('./features/profile/components/security/security.component').then(m => m.SecurityComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/components/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
];
