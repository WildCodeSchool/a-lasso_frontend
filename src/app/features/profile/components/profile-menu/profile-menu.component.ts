import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
})
export class ProfileMenuComponent {
  menuItems = [
    {
      label: 'Activités',
      link: '/profile/association/activities',
      icon: 'fas fa-user-circle',
    },
    {
      label: 'Profil',
      link: '/profile/association/profile',
      icon: 'fas fa-id-badge',
    },
    {
      label: 'Sécurité',
      link: '/profile/association/security',
      icon: 'fas fa-lock',
    },
    {
      label: 'Préférences',
      link: '/profile/association/settings',
      icon: 'fas fa-sliders-h',
    },
  ];
}
