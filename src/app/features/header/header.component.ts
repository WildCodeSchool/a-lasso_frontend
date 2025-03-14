import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterModalComponent } from '../authentication/components/register-modal/register-modal.component';
import { LoginModalComponent } from '../authentication/components/login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [RegisterModalComponent, CommonModule, RouterLink, LoginModalComponent],
  providers: [MessageService],
})
export class HeaderComponent {
  showRegisterModal = false;
  showLoginModal = false;

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }
}
