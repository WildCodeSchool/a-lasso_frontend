import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserRole } from '../../../features/authentication/constants/auth.constants';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { BadgeComponent } from '../badge/badge.component';
import { AuthFacade } from '../../../features/authentication/services/auth-facade.service';

@Component({
  selector: 'app-header-menu-reports',
  imports: [AsyncPipe, BadgeComponent],
  templateUrl: './header-menu-reports.component.html',
  styleUrl: './header-menu-reports.component.scss',
})
export class HeaderMenuReportsComponent {
  private _authService: AuthService = inject(AuthService);
  private _authFacade: AuthFacade = inject(AuthFacade);
  private _user$ = this._authFacade.user$;
  router: Router = inject(Router);

  @Input() isOpenMenu!: boolean;
  isAdmin$ = this._authService.getRolesUser().pipe(map((roles: UserRole[]) => roles.some(role => role === UserRole.ADMIN)));

  countGlobalReportsNotifications$: Observable<number | null> = this._user$.pipe(
    map(user => {
      if (!user || !user.notifications.reports) return null;
      return user.notifications.reports;
    })
  );
}
