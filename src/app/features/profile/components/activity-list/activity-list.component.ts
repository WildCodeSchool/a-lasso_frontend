import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ActivityCardComponent } from 'src/app/features/activity/components/activity-card/activity-card.component';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { ProfileFacadeService } from '../../services/profile-facade.service';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent {
  @Input() activities: Activity[] = [];

  private _confirmation = inject(ConfirmationService);
  private _toast = inject(MessageService);
  private _profileFacade = inject(ProfileFacadeService);
  private _activitiesFacade = inject(ActivityFacadeService);

  activities$ = this._profileFacade.activities$;

  onDeleteActivity(activityId: string): void {
    const activity = this.activities.find(a => a.id === activityId);
    if (!activity) return;

    this._confirmation.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this._activitiesFacade.deleteActivityAndUpdateStore(activityId).subscribe({
          next: () => {
            this._toast.add({ severity: 'success', summary: 'Activité supprimée' });
            this.activities = this.activities.filter(a => a.id !== activityId);
          },
          error: () => {
            this._toast.add({ severity: 'error', summary: 'Erreur', detail: "Échec de la suppression de l'activité" });
          },
        });
      },
    });
  }
}
