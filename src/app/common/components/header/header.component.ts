import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ButtonStyleClass } from 'src/app/common/models/button';
import { RegisterModalComponent } from 'src/app/features/authentication/components/register-modal/register-modal/register-modal.component';
import { UserHeaderInfo } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { SingleButtonComponent } from '../single-button/single-button.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { DestroyableComponent } from 'src/app/common/utils/DestroyableComponent';
import { LoginModalComponent } from 'src/app/features/authentication/components/login-modal/login-modal.component';
import { ForgotPasswordModalComponent } from 'src/app/features/authentication/components/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RegisterModalComponent,
    CommonModule,
    RouterLink,
    LoginModalComponent,
    HeaderMenuComponent,
    SingleButtonComponent,
    ForgotPasswordModalComponent,
  ],
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
export class HeaderComponent extends DestroyableComponent implements OnInit {
  private _authFacade = inject(AuthFacade);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  showRegisterModal = false;
  showLoginModal = false;
  showPasswordForgottenModal = false;
  ButtonStyleClass = ButtonStyleClass;

  userInfos$: Observable<UserHeaderInfo> = this._authFacade.getUserHeaderInfo();

  ngOnInit(): void {
    this._authService.openLoginModal$.pipe(this.untilDestroyed()).subscribe(() => {
      this.handleLoginModal(true);
    });
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  handleLoginModal(status: boolean): void {
    this.showLoginModal = status;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  openPasswordForgottenModal(): void {
    this.showPasswordForgottenModal = true;
  }

  isOnActivityCreationPage(): boolean {
    return this._router.url === '/activity/creation';
  }
}
