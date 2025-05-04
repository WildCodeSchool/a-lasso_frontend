import { Component, inject, OnInit } from '@angular/core';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { TableModule } from 'primeng/table';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../../models/report.model';
import { Column, TableData } from '../../../../common/models/table-data';

@Component({
  selector: 'app-report-home-page',
  imports: [ToggleMenuComponent, TableModule, TableDataComponent],
  templateUrl: './report-home-page.component.html',
  styleUrl: './report-home-page.component.scss',
})
export class ReportHomePageComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);

  reports: Report[];
  reportsTableColumns: Column[];
  reportsTableData: TableData[];

  navigationItems: string[] = ['Associations', 'Volontaires'];

  ngOnInit(): void {
    this.reports = this._route.snapshot.data['reports'];

    this.reportsTableColumns = [
      {
        field: 'date',
        header: 'Date',
      },
      {
        field: 'type',
        header: 'Type',
      },
      {
        field: 'reporter',
        header: 'Plaignant',
      },
      {
        field: 'reported',
        header: 'Accusé',
      },
    ];
  }
}
