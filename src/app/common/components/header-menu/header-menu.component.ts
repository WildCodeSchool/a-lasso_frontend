import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { BadgeComponent } from '../badge/badge.component';
import { HeaderMenuMessagesComponent } from '../header-menu-messages/header-menu-messages.component';
import { HeaderMenuReportsComponent } from '../header-menu-reports/header-menu-reports.component';
import { filter } from 'rxjs/operators';

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
  private _authService = inject(AuthService);

  isOpen: boolean = false;
  apiUrl: string = environment.apiUrl;

  isAssociation$: Observable<boolean> = this._authService.isAssociationUser();
  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();
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

  constructor() {
    this._router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      this.closeMenu();
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  async goToProfile(): Promise<void> {
    this.isOpen = false;

    const [isAssociation, isVoluntary] = await Promise.all([firstValueFrom(this.isAssociation$), firstValueFrom(this.isVoluntary$)]);

    if (isAssociation) {
      this._router.navigate(['/profile/association/activities']);
    } else if (isVoluntary) {
      this._router.navigate(['/profile/voluntary/activities']);
    }
  }

  logout(): void {
    this._authFacade.logout();
    this.isOpen = false;
  }
}
