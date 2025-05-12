import { Component, inject, OnInit } from '@angular/core';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { TableModule } from 'primeng/table';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { Report, reportTypeLabels } from '../../models/report.model';
import { Column, TableData } from '../../../../common/models/table-data';
import { NavigationItems } from '../../../../common/models/toggleMenu';
import { ReportDetailsModalComponent } from '../../components/report-details-modal/report-details-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-home-page',
  imports: [ToggleMenuComponent, TableModule, TableDataComponent, ReportDetailsModalComponent],
  templateUrl: './report-home-page.component.html',
  styleUrl: './report-home-page.component.scss',
})
export class ReportHomePageComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);

  allReports: Report[] = [];
  reportsTableData: TableData[];
  reportsTableColumns: Column[] = [];
  reportSelected: Report;

  navigationItems: NavigationItems[] = [
    {
      name: 'Associations',
      badgeValue: 0,
    },
    {
      name: 'Volontaires',
      badgeValue: 0,
    },
  ];
  activeNavigation: number = 0;
  isReportDetailModalOpen: boolean = false;

  ngOnInit(): void {
    this.allReports = this._route.snapshot.data['reports'];

    this.reportsTableColumns = [
      { field: 'date', header: 'Date' },
      { field: 'type', header: 'Type' },
      { field: 'reporter', header: 'Plaignant' },
      { field: 'reported', header: 'Mis en cause' },
    ];

    this._filterReportsByNavigation();
  }

  handleNavigation(chosenNavigation: string): void {
    this.activeNavigation = this.navigationItems.findIndex(item => item.name === chosenNavigation) ?? 0;
    this._filterReportsByNavigation();
  }

  private _filterReportsByNavigation(): void {
    const associationReports = this.allReports.filter(report => report.reportedUser.type === 'association');
    const voluntaryReports = this.allReports.filter(report => report.reportedUser.type === 'voluntary');

    this.navigationItems = [
      { name: 'Associations', badgeValue: associationReports.length },
      { name: 'Volontaires', badgeValue: voluntaryReports.length },
    ];

    const filterType = this.activeNavigation === 0 ? 'association' : 'voluntary';
    const filteredReports = filterType === 'association' ? associationReports : voluntaryReports;

    this.reportsTableData = filteredReports.map(report => ({
      reportId: report.reportId,
      date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
      type: reportTypeLabels[report.reportType],
      reporter: report.reporterUser?.userName ?? '',
      reported: report.reportedUser.userName,
    }));
  }

  onRowClick = (row: TableData): void => {
    this.reportSelected = this.allReports.find(report => report.reportId === row['reportId']);
    this.isReportDetailModalOpen = true;
  };
}
