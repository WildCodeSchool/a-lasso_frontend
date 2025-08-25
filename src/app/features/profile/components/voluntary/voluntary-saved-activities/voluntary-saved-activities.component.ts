import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VoluntaryProfileFacadeService } from '../../../services/voluntary-profil-facade.service';
import { ActivityListComponent } from '../../activity-list/activity-list.component';

@Component({
  selector: 'app-voluntary-saved-activities',
  standalone: true,
  imports: [CommonModule, ActivityListComponent],
  templateUrl: './voluntary-saved-activities.component.html',
})
export class VoluntarySavedActivitiesComponent {
  private _voluntaryProfileFacadeService = inject(VoluntaryProfileFacadeService);
  readonly savedActivities$ = this._voluntaryProfileFacadeService.savedActivities$;
}
