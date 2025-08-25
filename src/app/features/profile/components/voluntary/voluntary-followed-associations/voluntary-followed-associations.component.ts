import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VoluntaryProfileFacadeService } from '../../../services/voluntary-profil-facade.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-voluntary-followed-associations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './voluntary-followed-associations.component.html',
  styleUrls: ['./voluntary-followed-associations.component.scss'],
})
export class VoluntaryFollowedAssociationsComponent {
  private _voluntaryProfileFacadeService = inject(VoluntaryProfileFacadeService);
  readonly followedAssociations$ = this._voluntaryProfileFacadeService.followedAssociationsDetails$;
}
