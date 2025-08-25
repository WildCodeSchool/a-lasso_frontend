import { Component } from '@angular/core';
import { ProfileMenuComponent } from '../../profile-menu/profile-menu.component';

@Component({
  selector: 'app-association-profile-menu',
  standalone: true,
  imports: [ProfileMenuComponent],
  templateUrl: './association-profile-menu.component.html',
})
export class AssociationProfileMenuComponent {
  menuItems = [
    { label: 'Activités', link: '/profile/association/activities', icon: 'fas fa-user-circle' },
    { label: 'Profil', link: '/profile/association/about', icon: 'fas fa-id-badge' },
    { label: 'Sécurité', link: '/profile/association/security', icon: 'fas fa-lock' },
    { label: 'Préférences', link: '/profile/association/settings', icon: 'fas fa-sliders-h' },
  ];
}
