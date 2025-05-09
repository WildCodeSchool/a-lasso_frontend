import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { environment } from 'src/environments/environment.development';
import { MessageNotification, UserType } from 'src/app/features/authentication/models/user.model';
import { BadgeComponent } from '../badge/badge.component';
import { UUIDTypes } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
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
  private _auth = inject(AuthFacade);
  private _router = inject(Router);

  isOpen: boolean = false;
  isMessagesOpen: boolean = false;
  apiUrl: string = environment.apiUrl;

  user$ = this._auth.user$;

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
      if (!user) return null;
      return user.messageNotifications.reduce((total, notification) => total + notification.countMessagesNotRead, 0);
    })
  );

  activitiesWithUnreadMessages$: Observable<MessageNotification[] | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      return user.messageNotifications;
    })
  );

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  logout(): void {
    this._auth.logout();
    this.isOpen = false;
  }

  toggleMessages(event: Event): void {
    event.stopPropagation();
    this.isMessagesOpen = !this.isMessagesOpen;
  }

  navigateToActivityMessages(activityId: UUIDTypes): void {
    this._router.navigate([`/activity/${activityId}`]);
  }
}
