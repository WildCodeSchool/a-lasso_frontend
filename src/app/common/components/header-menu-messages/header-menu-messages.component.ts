import { Component, inject, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MessageNotification } from '../../../features/authentication/models/user.model';
import { AuthFacade } from '../../../features/authentication/services/auth-facade.service';
import { BadgeComponent } from '../badge/badge.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { UUIDTypes } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu-messages',
  imports: [BadgeComponent, AsyncPipe, NgClass],
  templateUrl: './header-menu-messages.component.html',
  styleUrl: './header-menu-messages.component.scss',
})
export class HeaderMenuMessagesComponent {
  private _router = inject(Router);
  private _authFacade: AuthFacade = inject(AuthFacade);
  @Input() isOpenMenu!: boolean;

  user$ = this._authFacade.user$;

  isMessagesOpen: boolean = false;

  countGlobalMessageNotifications$: Observable<number | null> = this.user$.pipe(
    map(user => {
      if (!user || !user.notifications.messages) return null;
      return user.notifications.messages.reduce((total, notification) => total + notification.countMessagesNotRead, 0);
    })
  );

  activitiesWithUnreadMessages$: Observable<MessageNotification[] | null> = this.user$.pipe(
    map(user => {
      if (!user || !user.notifications.messages) return null;
      return user.notifications.messages;
    })
  );

  toggleMessages(event: Event): void {
    event.stopPropagation();
    this.isMessagesOpen = !this.isMessagesOpen;
  }

  navigateToActivityMessages(activityId: UUIDTypes): void {
    this._router.navigate([`/activity/${activityId}`]);
    this.isOpenMenu = !this.isOpenMenu;
  }
}
