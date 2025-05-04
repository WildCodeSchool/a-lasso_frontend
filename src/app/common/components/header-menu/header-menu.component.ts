import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { environment } from 'src/environments/environment.development';
import { UserType } from 'src/app/features/authentication/models/user.model';
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

  isOpen: boolean = false;
  apiUrl: string = environment.apiUrl;

  user$ = this._authFacade.user$;

  userAvatar$: Observable<string | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      if (user.type === UserType.Voluntary) {
        return user.avatar.url;
      }
      return user.associationLogoImage;
    })
  );

  countGlobalNotifications$: Observable<number | null> = this.user$.pipe(
    map(user => {
      if (!user || !user.notifications) return null;
      const messagesCount = user.notifications.messages.reduce((total, notification) => total + notification.countMessagesNotRead, 0);

      const reportsCount = user.notifications.reports ?? 0;

      return messagesCount + reportsCount;
    })
  );

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  logout(): void {
    this._authFacade.logout();
    this.isOpen = false;
  }
}
