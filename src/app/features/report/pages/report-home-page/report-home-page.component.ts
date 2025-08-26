import { Component, inject, OnInit } from '@angular/core';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { TableModule } from 'primeng/table';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { Report, ReportsByUsers, reportTypeLabels, StatusReportEnum } from '../../models/report.model';
import { Column, TableData } from '../../../../common/models/table-data';
import { NavigationItems } from '../../../../common/models/toggle-menu';
import { ReportDetailsModalComponent } from '../../components/report-details-modal/report-details-modal.component';
import { map, Observable, of, take } from 'rxjs';
import { ReportFacadeService } from '../../services/report-facade.service';
import { AsyncPipe } from '@angular/common';
import { TAKE_1 } from '../../../../common/constants/observables.constants';
import { DestroyableComponent } from '../../../../common/utils/DestroyableComponent';

@Component({
  selector: 'app-report-home-page',
  imports: [ToggleMenuComponent, TableModule, TableDataComponent, ReportDetailsModalComponent, AsyncPipe],
  templateUrl: './report-home-page.component.html',
  styleUrl: './report-home-page.component.scss',
})
export class ReportHomePageComponent extends DestroyableComponent implements OnInit {
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  allReports$: Observable<Report[]>;
  reportsTableData$: Observable<TableData[]>;
  navigationItems$: Observable<NavigationItems[]> = of([
    {
      name: 'Associations',
      badgeValue: 0,
    },
    {
      name: 'Volontaires',
      badgeValue: 0,
    },
  ]);

  reportsTableColumns: Column[] = [
    { field: 'date', header: 'Date' },
    { field: 'type', header: 'Type' },
    { field: 'reporter', header: 'Plaignant' },
    { field: 'reported', header: 'Mis en cause' },
  ];
  reportSelected: Report;
  activeNavigation: number = 0;
  isReportDetailModalOpen: boolean = false;

  ngOnInit(): void {
    this.allReports$ = this._reportFacadeService.getReportsFromStore$();
    this._filterReportsByNavigation();
  }

  handleNavigation(chosenNavigation: string): void {
    this.navigationItems$.pipe(take(TAKE_1)).subscribe(navigationItems => {
      this.activeNavigation = navigationItems.findIndex(item => item.name === chosenNavigation) ?? 0;
    });

    this._filterReportsByNavigation();
  }

  private _filterReportsByNavigation(): void {
    const filteredReports$ = this._filteredReports();

    this.navigationItems$ = filteredReports$.pipe(
      map(({ assocReports, volReports }) => [
        { name: 'Associations', badgeValue: assocReports.length },
        { name: 'Volontaires', badgeValue: volReports.length },
      ])
    );

    this.reportsTableData$ = filteredReports$.pipe(
      map(({ assocReports, volReports }) => {
        const reports = this.activeNavigation === 0 ? assocReports : volReports;
        return reports.map(report => ({
          reportId: report.reportId,
          date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
          type: reportTypeLabels[report.reportType],
          reporter: report.reporterUser?.userName ?? '',
          reported: report.reportedUser.userName,
        }));
      })
    );
  }

  onRowClick = (row: TableData): void => {
    this.allReports$.pipe(this.untilDestroyed()).subscribe(reports => {
      this.reportSelected = reports.find(report => report.reportId === row['reportId']);
      this.isReportDetailModalOpen = true;
    });
  };

  private _filteredReports(): Observable<ReportsByUsers> {
    return this.allReports$.pipe(
      map(reports => {
        const assocReports = reports.filter(report => report.reportedUser.type === 'association' && report.status === StatusReportEnum.InProgress);
        const volReports = reports.filter(report => report.reportedUser.type === 'voluntary' && report.status === StatusReportEnum.InProgress);
        return { assocReports, volReports };
      })
    );
  }
}
