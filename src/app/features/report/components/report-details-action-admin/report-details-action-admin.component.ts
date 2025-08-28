import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Report, StatusReportEnum } from '../../models/report.model';
import { ReportFacadeService } from '../../services/report-facade.service';
import { FormGroup } from '@angular/forms';
import { UserType } from '../../../authentication/models/user.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { showSuccessToast } from '../../../../common/utils/toast.utils';
import { SplitButton } from 'primeng/splitbutton';

@Component({
  selector: 'app-report-details-action-admin',
  imports: [Button, SplitButton],
  templateUrl: './report-details-action-admin.component.html',
  styleUrl: './report-details-action-admin.component.scss',
})
export class ReportDetailsActionAdminComponent implements OnInit {
  protected readonly StatusReportEnum = StatusReportEnum;
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);
  private _confirmation: ConfirmationService = inject(ConfirmationService);
  private _toast: MessageService = inject(MessageService);

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() submitReportEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() visible: boolean = false;
  @Input() reportSelected!: Report;
  @Input() reportForm!: FormGroup;

  reporterActions: MenuItem[] = [];
  reportedActions: MenuItem[] = [];

  ngOnInit(): void {
    this.reporterActions = [
      {
        label: 'Contacter',
        icon: 'fa-regular fa-paper-plane',
        url: 'mailto:' + this.reportSelected.reporterUser.email,
        target: '_blank',
      },
      {
        label: 'Bannir',
        icon: 'fa-solid fa-user-xmark',
        command: (): void => this.banUser('reporter'),
      },
    ];

    this.reportedActions = [
      {
        label: 'Contacter',
        icon: 'fa-regular fa-paper-plane',
        url: 'mailto:' + this.reportSelected.reportedUser.email,
        target: '_blank',
      },
      {
        label: 'Bannir',
        icon: 'fa-solid fa-user-xmark',
        command: (): void => this.banUser('reported'),
      },
    ];
  }

  saveReport(): void {
    const updatedReport: Report = {
      ...this.reportSelected,
      commentaryAdmin: this.reportForm.value.commentaryAdmin,
    };
    this._reportFacadeService.updateReport(updatedReport);
  }

  closeReport(): void {
    this.submitReportEvent.emit(this.reportForm);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this._confirmation.confirm({
      message: 'Êtes-vous sûr de vouloir clôturer le signalement ? Cette action est irréversible.',
      header: 'Confirmation de clôture',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, clôturer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const updatedReport: Report = {
          ...this.reportSelected,
          commentaryAdmin: this.reportForm.value.commentaryAdmin,
          status: StatusReportEnum.Closed,
        };
        this._reportFacadeService.updateReport(updatedReport);
      },
    });
  }

  banUser(userBan: string): void {
    this.submitReportEvent.emit(this.reportForm);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    let userType: string;

    this._confirmation.confirm({
      message: 'Êtes-vous sûr de vouloir bannir cet utilisateur ? Cette action est irréversible.',
      header: 'Confirmation du bannissement',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui, bannir',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        switch (userBan) {
          case 'reporter':
            userType = this.reportSelected.reporterUser.type;
            this._reportFacadeService.banUser(this.reportSelected.reporterUser.id, userType);

            break;
          case 'reported':
            userType = this.reportSelected.reportedUser.type;
            this._reportFacadeService.banUser(this.reportSelected.reportedUser.id, userType);
            break;
          default:
            console.error(`user banned type is not available: ${userBan}`);
        }
        const updatedReport: Report = {
          ...this.reportSelected,
          commentaryAdmin: this.reportForm.value.commentaryAdmin,
          status: userType === UserType.Association ? StatusReportEnum.AssociationBanned : StatusReportEnum.VoluntaryBanned,
        };

        this._reportFacadeService.updateReport(updatedReport);
        showSuccessToast(this._toast);
      },
    });
  }
}
