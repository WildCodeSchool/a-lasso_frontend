import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssociationProfileMenuComponent } from '../../components/association/association-profile-menu/association-profile-menu.component';

@Component({
  selector: 'app-association-profile-page',
  standalone: true,
  imports: [RouterOutlet, AssociationProfileMenuComponent],
  templateUrl: './association-profile-page.component.html',
  styleUrls: ['./association-profile-page.component.scss'],
})
export class AssociationProfilePageComponent implements OnInit {
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
