import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterModalComponent } from '../authentication/components/register-modal/register-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [RegisterModalComponent, CommonModule, RouterLink],
  providers: [MessageService],
})
export class HeaderComponent {
  showRegisterModal = false;

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }
}
