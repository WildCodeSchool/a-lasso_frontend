import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { environment } from 'src/environments/environment';
import { BadgeComponent } from '../badge/badge.component';
import { HeaderMenuMessagesComponent } from '../header-menu-messages/header-menu-messages.component';
import { HeaderMenuReportsComponent } from '../header-menu-reports/header-menu-reports.component';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [CommonModule, BadgeComponent, HeaderMenuMessagesComponent, HeaderMenuReportsComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss',
  animations: [
    trigger('fadeMenu', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))]),
    ]),
  ],
})
export class HeaderMenuComponent {
  private _authFacade: AuthFacade = inject(AuthFacade);
  private _router = inject(Router);
  private _elementRef = inject(ElementRef);

  isOpen: boolean = false;
  apiUrl: string = environment.apiUrl;

  user$ = this._authFacade.user$;
  userAvatar$ = this._authFacade.userAvatar$;

  countGlobalNotifications$: Observable<number | null> = this.user$.pipe(
    map(user => {
      if (!user || !user.notification) return null;
      const messagesCount = user.notification.messages.reduce((total, notification) => total + notification.countMessagesNotRead, 0);

      const reportsCount = user.notification.reports ?? 0;

      return messagesCount + reportsCount;
    })
  );

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  goToProfile(): void {
    this.isOpen = false;
    this._router.navigate(['/profile/association/activities']);
  }

  logout(): void {
    this._authFacade.logout();
    this.isOpen = false;
  }
}
