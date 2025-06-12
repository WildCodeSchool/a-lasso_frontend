import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileMenuComponent } from '../../components/profile-menu/profile-menu.component';

@Component({
  selector: 'app-association-profile-page',
  standalone: true,
  imports: [RouterOutlet, ProfileMenuComponent],
  templateUrl: './association-profile-page.component.html',
  styleUrl: './association-profile-page.component.scss',
})
export class AssociationProfilePageComponent {}
