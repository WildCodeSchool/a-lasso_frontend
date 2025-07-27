import { Routes } from '@angular/router';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';
import { ActivityDetailsComponent } from './features/activity/pages/activity-details/activity-details.component';
import { activityDetailsResolver } from './common/resolvers/activity-details.resolver';
import { AssociationDetailsComponent } from './features/association/pages/association-details/association-details.component';
import { associationResolver } from './common/resolvers/association.resolver';
import { ActivityCreationComponent } from './features/activity/pages/activity-creation/activity-creation.component';
import { isLoggedInGuard } from './common/guards/is-logged-in.guard';
import { isAssociationGuard } from './common/guards/is-association.guard';
import { ReportHomePageComponent } from './features/report/pages/report-home-page/report-home-page.component';
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
    path: 'activity/creation/:id',
    canActivate: [isLoggedInGuard, isAssociationGuard],
    component: ActivityCreationComponent,
  },
  {
    path: 'reports',
    component: ReportHomePageComponent,
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
        loadComponent: () =>
          import('./features/profile/components/account-settings-security/account-settings-security.component').then(
            m => m.AccountSettingsSecurityComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/components/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
];
