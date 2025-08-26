import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoluntaryProfileMenuComponent } from '../../components/voluntary/voluntary-profile-menu/voluntary-profile-menu.component';

@Component({
  selector: 'app-voluntary-profile-page',
  standalone: true,
  imports: [RouterOutlet, VoluntaryProfileMenuComponent],
  templateUrl: './voluntary-profile-page.component.html',
  styleUrls: ['./voluntary-profile-page.component.scss'],
})
export class VoluntaryProfilePageComponent {}
