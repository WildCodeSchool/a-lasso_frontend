import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';
import { ActivityCardComponent } from 'src/app/features/activity/components/activity-card/activity-card.component';
import { Activity } from 'src/app/features/activity/models/activity.model';
import { ActivityFacadeService } from 'src/app/features/activity/services/activity-facade.service';
import { AssociationProfileFacadeService } from '../../services/association-profile-facade.service';
import { ActivityStatusEnum } from 'src/app/features/activity/models/activity-creation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent {
  @Input() activities: Activity[] = [];

  public ActivityStatusEnum = ActivityStatusEnum;

  private _router = inject(Router);
  private _confirmation = inject(ConfirmationService);
  private _toast = inject(MessageService);
  private _profileFacade = inject(AssociationProfileFacadeService);
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
        showSuccessToast(this._toast);
      },
    });
  }

  onEditActivity(activityId: string): void {
    this._router.navigate([`/activity/creation/${activityId}`]);
  }
}
