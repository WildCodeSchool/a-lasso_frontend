import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { LoginModalComponent } from 'src/app/features/authentication/components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'src/app/features/authentication/components/register-modal/register-modal/register-modal.component';
import { UserHeaderInfo } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SingleButtonComponent } from '../single-button/single-button.component';
import { ButtonStyleClass } from 'src/app/common/models/button';

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
  private _router = inject(Router);

  showRegisterModal = false;
  showLoginModal = false;
  ButtonStyleClass = ButtonStyleClass;

  userInfos$: Observable<UserHeaderInfo> = this._authFacade.getUserHeaderInfo();

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  isOnActivityCreationPage(): boolean {
    return this._router.url === '/activity/creation';
  }
}
