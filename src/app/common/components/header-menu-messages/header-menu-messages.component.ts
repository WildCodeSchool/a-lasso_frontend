import { Component, inject, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AssociationLogin, MessageNotification, VoluntaryLogin } from '../../../features/authentication/models/user.model';
import { AuthFacade } from '../../../features/authentication/services/auth-facade.service';
import { BadgeComponent } from '../badge/badge.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { UUIDTypes } from 'uuid';
import { Router } from '@angular/router';
import { MessagesInfo } from '../../models/header-menu';

@Component({
  selector: 'app-header-menu-messages',
  imports: [BadgeComponent, AsyncPipe, NgClass],
  templateUrl: './header-menu-messages.component.html',
  styleUrl: './header-menu-messages.component.scss',
})
export class HeaderMenuMessagesComponent {
  private _router: Router = inject(Router);
  private _authFacade: AuthFacade = inject(AuthFacade);
  @Input() isOpenMenu!: boolean;

  user$: Observable<VoluntaryLogin | AssociationLogin | null> = this._authFacade.user$;

  isMessagesOpen: boolean = false;

  readonly MessagesInfo$: Observable<MessagesInfo> = this.user$.pipe(
    map((user: VoluntaryLogin | AssociationLogin): MessagesInfo => {
      const messageNotifications: MessageNotification[] = user?.notification?.messages ?? [];
      const count: number = messageNotifications.reduce((sum: number, m: MessageNotification): number => sum + m.countMessagesNotRead, 0);
      return {
        messageNotifications,
        count,
        hasMessages: messageNotifications.length > 0 && count > 0,
      };
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
