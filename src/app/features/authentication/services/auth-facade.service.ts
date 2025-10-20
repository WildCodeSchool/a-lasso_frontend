import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, switchMap, take } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { UUIDTypes } from 'uuid';
import { ActivityFacadeService } from '../../activity/services/activity-facade.service';
import { Statistic } from '../../association/models/association.model';
import { ACTIVITY_LENGTH, UserRole } from '../constants/auth.constants';
import { ApiResponseLogin } from '../models/api-response.model';
import { AssociationLogin, UserHeaderInfo, UserLogin, UserType, VoluntaryLogin } from '../models/user.model';
import { AuthService } from './auth.service';
import { VoluntaryProfileService } from '../../profile/services/voluntary-profil.service';
import { MessageService } from 'primeng/api';
import { showErrorToast, showSuccessToast } from 'src/app/common/utils/toast.utils';
import { AssociationProfileService } from '../../profile/services/association-profil.service';
import { UserSelectors } from '../store/user.selectors';
import { UserActions } from '../store/user.actions';
import { ActivitiesActions } from '../../activity/store/activities.actions';
import { ActivitiesSelectors } from '../../activity/store/activities.selectors';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private _store = inject(Store);
  private _authService = inject(AuthService);
  private _activityFacade = inject(ActivityFacadeService);
  private _authApiService = inject(AuthApiService);
  private _voluntaryProfileService = inject(VoluntaryProfileService);
  private _associationProfileService = inject(AssociationProfileService);
  private _toast = inject(MessageService);
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

  updateEmail(newEmail: string, password: string): Observable<ApiResponseLogin> {
    return this._authService.changeEmail(password, newEmail).pipe(
      map(({ token, user }) => {
        this._authService.saveToken(token);
        this._store.dispatch(UserActions.loginSuccess({ userInfos: user }));
        showSuccessToast(this._toast);

        return { token, user };
      })
    );
  }

  deleteAccount(): Observable<void> {
    return this._authService.deleteAccount();
  }

  getConnectedUserId(): Observable<UUIDTypes> {
    return this.user$.pipe(map(user => user?.id ?? ''));
  }

  getUserHeaderInfo(): Observable<UserHeaderInfo> {
    return combineLatest([this._authService.getRolesUser(), this.user$]).pipe(
      map(([roles, user]) => {
        const minimumRequiredRoles = 0;
        const isConnected: boolean = roles.length > minimumRequiredRoles;
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

  getUserByToken(): void {
    const token = this._authService.getToken();
    if (token) {
      this._authApiService
        .getUserByToken()
        .pipe()
        .subscribe(response => this._store.dispatch(UserActions.loginSuccess({ userInfos: response.user })));
    }
  }

  refreshUser(): void {
    combineLatest([this._authService.isVoluntaryUser(), this._authService.isAssociationUser()])
      .pipe(
        take(TAKE_1),
        switchMap(([isVoluntary, isAssociation]) => {
          if (isVoluntary) {
            return this._voluntaryProfileService.getVoluntary();
          }
          if (isAssociation) {
            return this._associationProfileService.getAssociation();
          }
          return of(null);
        })
      )
      .subscribe(user => {
        if (user) {
          this._store.dispatch(UserActions.loginSuccess({ userInfos: user }));
        }
      });
  }

  resetPasswordRequest(email: string): void {
    this._authService.resetPasswordRequest(email).subscribe({
      next: () => {
        showSuccessToast(this._toast, 'Un email de réinitialisation a été envoyé.');
      },
    });
  }

  resetPasswordConfirm(token: string, newPassword: string): void {
    this._authService.resetPasswordConfirm(token, newPassword).subscribe({
      next: (success: boolean) => {
        if (success) {
          showSuccessToast(this._toast, 'Votre mot de passe a été réinitialisé avec succès.');
          this._router.navigate(['/']);
          this._authService.triggerLoginModal();
        } else {
          showErrorToast(this._toast, 'Erreur lors de la réinitialisation du mot de passe.');
        }
      },
    });
  }

  private _resetSession(): void {
    this._authService.clearToken();
  }

  private _handleLoginSuccess({ token, user }: ApiResponseLogin): void {
    this._authService.saveToken(token);
    this._authService.updateAuthState();

    if (!user) {
      this._store.dispatch(UserActions.loginFailure({ error: 'Utilisateur invalide' }));
      return;
    }

    this._activityFacade.getFutureActivitiesFromApi();
    this._store.dispatch(UserActions.loginSuccess({ userInfos: user }));

    this._store
      .select(ActivitiesSelectors.selectActivities)
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
