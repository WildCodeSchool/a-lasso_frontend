import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { LoginModalComponent } from 'src/app/features/authentication/components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'src/app/features/authentication/components/register-modal/register-modal/register-modal.component';
import { VoluntaryLogin } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterModalComponent, CommonModule, RouterLink, LoginModalComponent, HeaderMenuComponent],
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
  private _auth = inject(AuthFacade);

  showRegisterModal = false;
  showLoginModal = false;

  isAuthenticated$ = this._auth.isAuthenticated$;
  user$ = this._auth.user$;

  userDisplayName$: Observable<string | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      const isAssociation = 'name' in user;
      if (isAssociation) {
        return user.name;
      }

      const voluntary = user as VoluntaryLogin;
      return `${voluntary.first_name} ${voluntary.last_name}`;
    })
  );

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }
}
