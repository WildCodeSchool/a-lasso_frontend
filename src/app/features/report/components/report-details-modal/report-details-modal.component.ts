import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import {
  Report,
  ReportCountByYear,
  ReporterCountByYear,
  ReportTypeEnum,
  reportTypeLabels,
  reportTypeStatus,
  StatusReportEnum,
} from '../../models/report.model';
import { FormField } from '../../../authentication/models/form.model';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { ReportFacadeService } from '../../services/report-facade.service';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Column, TableData } from '../../../../common/models/table-data';
import { Observable, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select } from 'primeng/select';
import { UUIDTypes } from 'uuid';

@Component({
  selector: 'app-report-details-modal',
  imports: [Dialog, DatePipe, Button, TableDataComponent, TextareaFieldComponent, ReactiveFormsModule, Select, FormsModule],
  templateUrl: './report-details-modal.component.html',
  styleUrl: './report-details-modal.component.scss',
})
export class ReportDetailsModalComponent implements OnInit {
  private readonly _fb: FormBuilder = new FormBuilder();
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() reportSelected!: Report;

  public allReportedUserReports: Observable<Report[]>;
  public StatusReportEnum = StatusReportEnum;
  public maxLengthCommentary: number = 1000;
  public yearsOfStats: number[] = [];
  public yearOptions: { label: number; value: number }[] = [];
  public countReportsUserByYear: ReportCountByYear[] = [];
  public countReporterUserByYear: ReporterCountByYear[] = [];
  selectedYear!: number;

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
    this.allReportedUserReports = this._reportFacadeService.getReportsFromStoreById$(this.reportSelected);

    this.allReportedUserReports.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(reports => {
      this.otherReportsTableData = reports.map(report => ({
        reportId: report.reportId,
        date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
        type: reportTypeLabels[report.reportType],
        reporter: report.reporterUser?.userName ?? '',
        status: reportTypeStatus[report.status],
      }));

      this.reportForm.patchValue({
        commentaryAdmin: this.reportSelected.commentaryAdmin || '',
      });

      this._analyseStatsByYear(reports);
    });
  }

  getStatsByYear(year: number): { totalReports: number; uniqueReporters: number } {
    const totalReports = this.countReportsUserByYear.find(s => s.year === year)?.reports || 0;
    const uniqueReporters = this.countReporterUserByYear.find(s => s.year === year)?.uniqueReporters || 0;
    return { totalReports, uniqueReporters };
  }

  private _analyseStatsByYear(reports: Report[]): void {
    const yearMap = new Map<number, { reports: number; reporters: Set<UUIDTypes> }>();

    for (const report of reports) {
      const date = new Date(report.createdAt);

      const year = date.getFullYear();
      const reporterId = report.reporterUser?.id;

      if (!yearMap.has(year)) {
        yearMap.set(year, { reports: 0, reporters: new Set() });
      }

      const stats = yearMap.get(year)!;
      stats.reports++;
      if (reporterId) stats.reporters.add(reporterId);
    }

    const sorted = Array.from(yearMap.entries()).sort((a, b) => b[0] - a[0]);

    this.yearsOfStats = sorted.map(([year]) => year);
    this.yearOptions = this.yearsOfStats.map(year => ({ label: year, value: year }));

    if (this.yearOptions.length > 0) {
      this.selectedYear = this.yearOptions[0].value;
    }

    this.countReportsUserByYear = sorted.map(([year, { reports }]) => ({ year, reports }));
    this.countReporterUserByYear = sorted.map(([year, { reporters }]) => ({ year, uniqueReporters: reporters.size }));
  }

  onSelectedOtherReport(report: TableData): void {
    this.allReportedUserReports
      .pipe(
        take(1),
        tap(reports => {
          const newSelectedReport = reports.find(reportData => reportData.reportId === report['reportId']);

          if (newSelectedReport) {
            this.reportSelected = newSelectedReport;
            this.reportForm.patchValue({
              commentaryAdmin: newSelectedReport.commentaryAdmin || '',
            });
          }
        })
      )
      .subscribe();
  }

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
