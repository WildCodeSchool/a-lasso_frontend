import { Routes } from '@angular/router';
import { isAdminGuard } from './common/guards/is-admin.guard';
import { isAssociationGuard } from './common/guards/is-association.guard';
import { isLoggedInGuard } from './common/guards/is-logged-in.guard';
import { isVoluntaryGuard } from './common/guards/is-voluntary.guard';
import { activityDetailsResolver } from './common/resolvers/activity-details.resolver';
import { associationResolver } from './common/resolvers/association.resolver';
import { ActivitiesHomeComponent } from './features/activity/pages/activities-home/activities-home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ActivitiesHomeComponent,
  },

  {
    path: 'activity/creation',
    canActivate: [isLoggedInGuard, isAssociationGuard],
    loadComponent: () => import('./features/activity/pages/activity-creation/activity-creation.component').then(m => m.ActivityCreationComponent),
  },
  {
    path: 'activity/creation/:id',
    canActivate: [isLoggedInGuard, isAssociationGuard],
    loadComponent: () => import('./features/activity/pages/activity-creation/activity-creation.component').then(m => m.ActivityCreationComponent),
  },
  {
    path: 'activity/:id',
    resolve: { activityDetails: activityDetailsResolver },
    loadComponent: () => import('./features/activity/pages/activity-details/activity-details.component').then(m => m.ActivityDetailsComponent),
  },

  {
    path: 'association/:id',
    resolve: { association: associationResolver },
    loadComponent: () =>
      import('./features/association/pages/association-details/association-details.component').then(m => m.AssociationDetailsComponent),
  },

  {
    path: 'reports',
    canActivate: [isLoggedInGuard, isAdminGuard],
    loadComponent: () => import('./features/report/pages/report-home-page/report-home-page.component').then(m => m.ReportHomePageComponent),
  },

  {
    path: 'profile/association',
    canActivate: [isLoggedInGuard, isAssociationGuard],
    loadComponent: () =>
      import('./features/profile/pages/association-profile-page/association-profile-page.component').then(m => m.AssociationProfilePageComponent),
    children: [
      { path: '', redirectTo: 'activities', pathMatch: 'full' },
      {
        path: 'activities',
        loadComponent: () =>
          import('./features/profile/components/association/association-activity-menu/association-activity-menu.component').then(
            m => m.AssociationActivityMenuComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/profile/components/association/association-about/association-about.component').then(m => m.AssociationAboutComponent),
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

  {
    path: 'profile/voluntary',
    canActivate: [isLoggedInGuard, isVoluntaryGuard],
    loadComponent: () =>
      import('./features/profile/pages/voluntary-profile-page/voluntary-profile-page.component').then(m => m.VoluntaryProfilePageComponent),
    children: [
      { path: '', redirectTo: 'activities', pathMatch: 'full' },
      {
        path: 'activities',
        loadComponent: () =>
          import('./features/profile/components/voluntary/voluntary-activity-menu/voluntary-activity-menu.component').then(
            m => m.VoluntaryActivityMenuComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/profile/components/voluntary/voluntary-about/voluntary-about.component').then(m => m.VoluntaryAboutComponent),
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

  {
    path: 'cgu',
    loadComponent: () => import('./features/authentication/components/legals/cgu/cgu.component').then(m => m.CguComponent),
  },
  {
    path: 'politique-confidentialite',
    loadComponent: () =>
      import('./features/authentication/components/legals/politique-confidentialite/politique-confidentialite.component').then(
        m => m.PolitiqueConfidentialiteComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/authentication/pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent),
  },

  { path: '**', redirectTo: '' },
];
