import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterModalComponent } from '../../../features/authentication/components/register-modal/register-modal.component';
import { LoginModalComponent } from '../../../features/authentication/components/login-modal/login-modal.component';
import { AuthService } from '../../../features/authentication/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [RegisterModalComponent, CommonModule, RouterLink, LoginModalComponent],
  providers: [MessageService],
})
export class HeaderComponent {
  private _authService: AuthService = inject(AuthService);
  public isLoggedIn = this._authService.isLoggedIn();
  showRegisterModal: boolean = false;
  showLoginModal: boolean = false;

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }
}
