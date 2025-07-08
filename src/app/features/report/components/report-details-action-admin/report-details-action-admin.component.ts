import { Component, inject, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Report, StatusReportEnum } from '../../models/report.model';
import { ReportFacadeService } from '../../services/report-facade.service';
import { FormGroup } from '@angular/forms';
import { UserType } from '../../../authentication/models/user.model';

@Component({
  selector: 'app-report-details-action-admin',
  imports: [Button],
  templateUrl: './report-details-action-admin.component.html',
  styleUrl: './report-details-action-admin.component.scss',
})
export class ReportDetailsActionAdminComponent {
  protected readonly StatusReportEnum = StatusReportEnum;
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Input() visible: boolean = false;
  @Input() reportSelected!: Report;
  @Input() reportForm!: FormGroup;

  saveReport(): void {
    const updatedReport: Report = {
      ...this.reportSelected,
      commentaryAdmin: this.reportForm.value.commentaryAdmin,
    };
    this._reportFacadeService.updateReport(updatedReport);
  }

  closeReport(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const updatedReport: Report = {
      ...this.reportSelected,
      commentaryAdmin: this.reportForm.value.commentaryAdmin,
      status: StatusReportEnum.Closed,
    };

    this._reportFacadeService.updateReport(updatedReport);
  }

  banUser(userBan: string): void {
    let userType: string;

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
  }
}
