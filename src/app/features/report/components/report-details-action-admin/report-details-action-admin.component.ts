import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Report, StatusReportEnum } from '../../models/report.model';
import { ReportFacadeService } from '../../services/report-facade.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-report-details-action-admin',
  imports: [Button],
  templateUrl: './report-details-action-admin.component.html',
  styleUrl: './report-details-action-admin.component.scss',
})
export class ReportDetailsActionAdminComponent {
  protected readonly StatusReportEnum = StatusReportEnum;
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
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
    this.visibleChange.emit(false);
  }
}
