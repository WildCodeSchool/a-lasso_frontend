import { Component } from '@angular/core';
import { ProfileMenuComponent } from '../../profile-menu/profile-menu.component';

@Component({
  selector: 'app-voluntary-profile-menu',
  standalone: true,
  imports: [ProfileMenuComponent],
  templateUrl: './voluntary-profile-menu.component.html',
})
export class VoluntaryProfileMenuComponent {
  menuItems = [
    { label: 'Activités', link: '/profile/voluntary/activities', icon: 'fas fa-user-circle' },
    { label: 'Profil', link: '/profile/voluntary/about', icon: 'fas fa-id-badge' },
    { label: 'Sécurité', link: '/profile/voluntary/security', icon: 'fas fa-lock' },
    { label: 'Préférences', link: '/profile/voluntary/settings', icon: 'fas fa-sliders-h' },
  ];
}
