import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { UUIDTypes } from 'uuid';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';
import * as ActivitiesActions from '../../activity/store/activities.actions';
import { selectActivities } from '../../activity/store/activities.selector';
import { Statistic } from '../../association/models/association.model';
import { ACTIVITY_LENGTH, UserRole } from '../constants/auth.constants';
import { ApiResponseLogin } from '../models/api-response.model';
import { AssociationLogin, UserHeaderInfo, UserLogin, UserType, VoluntaryLogin } from '../models/user.model';
import * as UserActions from '../store/user.actions';
import * as UserSelectors from '../store/user.selectors';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private _store = inject(Store);
  private _authService = inject(AuthService);
  private _activityFacade = inject(ActivityFacadeService);
  private _router = inject(Router);

  readonly user$: Observable<VoluntaryLogin | AssociationLogin | null> = this._store.select(UserSelectors.selectUser);
  readonly isAuthenticated$: Observable<boolean> = this._store.select(UserSelectors.selectIsAuthenticated);
  readonly error$: Observable<string> = this._store.select(UserSelectors.selectLoginError);
  readonly associationStats$: Observable<Statistic[]> = this._store.select(UserSelectors.selectAssociationStats);
  readonly userAvatar$: Observable<string | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      return user.type === UserType.Voluntary ? user.avatar.image : user.associationLogoImage.image;
    })
  );

  associationId$: Observable<UUIDTypes> = this._store.select(UserSelectors.selectConnectedAssociationId);

  login(credentials: UserLogin): void {
    this._resetSession();

    this._authService.login(credentials).subscribe({
      next: response => this._handleLoginSuccess(response),
      error: error => this._handleLoginError(error),
    });
  }

  logout(): void {
    this._authService.clearToken();
    this._authService.updateAuthState();
    this._store.dispatch(UserActions.logout());
    this._store.dispatch(ActivitiesActions.clearUserActivityInfos());
    this._router.navigate(['/']);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this._authService.changePassword(oldPassword, newPassword);
  }

  deleteAccount(): Observable<void> {
    return this._authService.deleteAccount();
  }

  getUserHeaderInfo(): Observable<UserHeaderInfo> {
    return combineLatest([this._authService.getRolesUser(), this.user$]).pipe(
      map(([roles, user]) => {
        const isConnected: boolean = roles.length > 0;
        const isAssociation: boolean = roles.includes(UserRole.ASSOCIATION);
        const canPublishActivity: boolean = isAssociation && this._router.url !== '/activity/creation';

        let userDisplayName: string = '';
        if (user) {
          userDisplayName = user.type === UserType.Voluntary ? `${user.first_name} ${user.last_name}` : user.name;
        }

        return {
          isConnected,
          canPublishActivity,
          userDisplayName,
        };
      })
    );
  }

  private _resetSession(): void {
    this._authService.clearToken();
    this._authService.clearUserState();
  }

  private _handleLoginSuccess({ token, user }: ApiResponseLogin): void {
    this._authService.saveToken(token);
    this._authService.updateAuthState();

    if (!user) {
      this._store.dispatch(UserActions.loginFailure({ error: 'Utilisateur invalide' }));
      return;
    }

    this._activityFacade.getAllActivitiesFromApi();
    this._store.dispatch(UserActions.loginSuccess({ userInfos: user }));

    this._store
      .select(selectActivities)
      .pipe(take(TAKE_1))
      .subscribe(activities => {
        if (activities.length === ACTIVITY_LENGTH) {
          this._syncUserMetadataWithStore(user);
        }
      });
  }

  private _handleLoginError(error: unknown): void {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Erreur de connexion';
    this._store.dispatch(UserActions.loginFailure({ error: message }));
  }

  private _syncUserMetadataWithStore(user: VoluntaryLogin | AssociationLogin): void {
    if (user.type === UserType.Voluntary) {
      user.activitiesUserInfos.forEach(activity => {
        this._store.dispatch(
          ActivitiesActions.updateActivitiesUserInfos({
            activityId: activity.activityId,
            isSaved: activity.isSaved,
            isRegistered: activity.isRegistered,
          })
        );
      });
    }
  }
}
