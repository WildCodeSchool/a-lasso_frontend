import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, Observable, tap } from 'rxjs';
import { LoginModalComponent } from 'src/app/features/authentication/components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'src/app/features/authentication/components/register-modal/register-modal/register-modal.component';
import { AssociationLogin, UserType, VoluntaryLogin } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SingleButtonComponent } from '../single-button/single-button.component';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { UserRole } from 'src/app/features/authentication/constants/auth.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterModalComponent, CommonModule, RouterLink, LoginModalComponent, HeaderMenuComponent, SingleButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MessageService],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent {
  private _authFacade = inject(AuthFacade);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  showRegisterModal = false;
  showLoginModal = false;
  ButtonStyleClass = ButtonStyleClass;
  UserRoleType = UserRole;

  userRoles$: Observable<UserRole[]> = this._authService.getRolesUser().pipe(tap(val => console.log("TAP VAL", val)));

  isAuthenticated$ = this._authFacade.isAuthenticated$;
  user$: Observable<VoluntaryLogin | AssociationLogin> = this._authFacade.user$;

  userDisplayName$: Observable<string | null> = this.user$.pipe(
    map(user => {

      if (!user) return null;
      if (user.type === UserType.Voluntary) {
        return `${user.first_name} ${user.last_name}`;
      }
      return user.name;
    })
  );

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  isAnAssociation(user: VoluntaryLogin | AssociationLogin): boolean {
    return user.type === UserType.Association;
  }

  isOnActivityCreationPage(): boolean {
    return this._router.url === '/activity/creation';
  }
}
