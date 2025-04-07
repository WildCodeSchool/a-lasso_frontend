import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VoluntaryLogin } from 'src/app/features/authentication/models/user.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [CommonModule],
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

  isOpen = false;
  apiUrl = environment.apiUrl;

  user$ = this._auth.user$;

  userAvatar$: Observable<string | null> = this.user$.pipe(
    map(user => {
      if (!user) return null;
      const isAssociation = 'name' in user;
      if (isAssociation) {
        return user.associationLogoImage ?? null;
      }
      const voluntary = user as VoluntaryLogin;
      return voluntary.avatar?.url ?? null;
    })
  );

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  logout(): void {
    this._auth.logout();
    this.isOpen = false;
  }
}
