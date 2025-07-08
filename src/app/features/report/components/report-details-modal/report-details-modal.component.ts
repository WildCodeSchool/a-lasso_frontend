import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Report, ReportTypeEnum, reportTypeLabels, reportTypeStatus } from '../../models/report.model';
import { FormField } from '../../../authentication/models/form.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { ReportFacadeService } from '../../services/report-facade.service';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Column, TableData } from '../../../../common/models/table-data';
import { Observable, take } from 'rxjs';
import { DestroyableComponent } from '../../../../common/utils/DestroyableComponent';
import { ReportDetailsStatsComponent } from '../report-details-stats/report-details-stats.component';
import { ReportDetailsActionAdminComponent } from '../report-details-action-admin/report-details-action-admin.component';
import { TAKE_1 } from '../../../../common/constants/observables.constants';

@Component({
  selector: 'app-report-details-modal',
  imports: [
    Dialog,
    DatePipe,
    TableDataComponent,
    TextareaFieldComponent,
    ReactiveFormsModule,
    FormsModule,
    ReportDetailsStatsComponent,
    AsyncPipe,
    ReportDetailsActionAdminComponent,
  ],
  templateUrl: './report-details-modal.component.html',
  styleUrl: './report-details-modal.component.scss',
})
export class ReportDetailsModalComponent extends DestroyableComponent implements OnInit {
  private readonly _fb: FormBuilder = new FormBuilder();
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() reportSelected!: Report;

  allReportedUserReports: Observable<Report[]>;
  maxLengthCommentary: number = 1000;

  otherReportsTableColumns: Column[] = [
    { field: 'date', header: 'Date' },
    { field: 'type', header: 'Type' },
    { field: 'reporter', header: 'Plaignant' },
    { field: 'status', header: 'Status' },
  ];
  otherReportsTableData: TableData[];
  readonly reportTypeLabels: Record<ReportTypeEnum, string> = reportTypeLabels;

  fieldCommentary: FormField = {
    name: 'commentaryAdmin',
    placeholder: 'Expliquer les conclusions du signalement ici.',
  };

  reportForm = this._fb.group({
    commentaryAdmin: ['', [Validators.required, Validators.maxLength(this.maxLengthCommentary)]],
  });

  ngOnInit(): void {
    this._initReportedUserReports();
    this._initFormFromReportSelected();
  }

  onSelectedOtherReport(report: TableData): void {
    this.allReportedUserReports.pipe(take(TAKE_1)).subscribe((reports: Report[]) => {
      const newSelectedReport: Report = reports.find(reportData => reportData.reportId === report['reportId']);
      if (!newSelectedReport) {
        return;
      }

      this.reportSelected = newSelectedReport;
      this.reportForm.patchValue({
        commentaryAdmin: newSelectedReport.commentaryAdmin || '',
      });
    });
  }

  private _initReportedUserReports(): void {
    this.allReportedUserReports = this._reportFacadeService.getReportsFromStoreById$(this.reportSelected);

    this.allReportedUserReports.pipe(this.untilDestroyed()).subscribe(reports => {
      this.otherReportsTableData = reports.map(report => ({
        reportId: report.reportId,
        date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
        type: reportTypeLabels[report.reportType],
        reporter: report.reporterUser?.userName ?? '',
        status: reportTypeStatus[report.status],
      }));
    });
  }

  private _initFormFromReportSelected(): void {
    this.reportForm.patchValue({
      commentaryAdmin: this.reportSelected.commentaryAdmin || '',
    });
  }
}
