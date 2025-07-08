import { Component, OnInit, Input, inject } from '@angular/core';
import { Report, ReportCountByYear, ReporterCountByYear, ReportStatsAnalysis } from '../../models/report.model';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ReportFacadeService } from '../../services/report-facade.service';

@Component({
  selector: 'app-report-details-stats',
  imports: [Select, FormsModule],
  templateUrl: './report-details-stats.component.html',
  styleUrl: './report-details-stats.component.scss',
})
export class ReportDetailsStatsComponent implements OnInit {
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);
  @Input() reports: Report[];

  yearsOfStats: number[] = [];
  yearOptions: { label: number; value: number }[] = [];
  countReportsUserByYear: ReportCountByYear[] = [];
  countReporterUserByYear: ReporterCountByYear[] = [];
  selectedYear!: number;

  ngOnInit(): void {
    const stats: ReportStatsAnalysis = this._reportFacadeService.getAnalyseStatsByYear(this.reports);

    this.yearsOfStats = stats.yearsOfStats;
    this.yearOptions = stats.yearOptions;
    this.selectedYear = stats.selectedYear;
    this.countReportsUserByYear = stats.countReportsUserByYear;
    this.countReporterUserByYear = stats.countReporterUserByYear;
  }

  getStatsByYear(year: number): { totalReports: number; uniqueReporters: number } {
    const totalReports = this.countReportsUserByYear.find(s => s.year === year)?.reports || 0;
    const uniqueReporters = this.countReporterUserByYear.find(s => s.year === year)?.uniqueReporters || 0;
    return { totalReports, uniqueReporters };
  }
}
