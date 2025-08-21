import { inject, Injectable } from '@angular/core';
import { ReportApiService } from './report-api.service';
import { Report, ReportStatsAnalysis, StatusReportEnum } from '../models/report.model';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { MessageService as Toast } from 'primeng/api';
import { Store } from '@ngrx/store';
import { AuthFacade } from '../../authentication/services/auth-facade.service';
import { UUIDTypes } from 'uuid';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';
import { ReportsActions } from '../store/reports.actions';
import { ReportsSelectors } from '../store/reports.selectors';
import { UserActions } from '../../authentication/store/user.actions';

@Injectable({
  providedIn: 'root',
})
export class ReportFacadeService {
  private _toast: Toast = inject(Toast);
  private _store: Store = inject(Store);
  private readonly _authStore: AuthFacade = inject(AuthFacade);
  private readonly _reportApiService: ReportApiService = inject(ReportApiService);

  getReportsFromApi(): Observable<Report[]> {
    return this._reportApiService.getReportsFromApi().pipe(
      tap((reports: Report[]) => {
        this._store.dispatch(ReportsActions.setReports({ reports: reports }));
      })
    );
  }

  getReportsFromStore$(): Observable<Report[]> {
    return this._store.select(ReportsSelectors.selectReports).pipe(
      switchMap(reports => {
        if (reports.length > 0) {
          return of(reports);
        }
        return this.getReportsFromApi();
      })
    );
  }

  getReportsFromStoreById$(report: Report): Observable<Report[]> {
    if (report.hasLoadedAllReports) {
      return this._store.select(ReportsSelectors.selectReportsById(report.reportId));
    }

    return this._reportApiService.getReportsByReportedIdFromApi(report.reportedUser.id).pipe(
      tap((reports: Report[]) => {
        const updatedReports: Report[] = reports.map(report => ({
          ...report,
          hasLoadedAllReports: true,
        }));
        this._store.dispatch(ReportsActions.setReports({ reports: updatedReports }));
      })
    );
  }

  sendReport(report: Report): void {
    this._reportApiService
      .sendReport(report)
      .pipe(
        tap(() => {
          showSuccessToast(this._toast);
          this._store.dispatch(UserActions.updateNotificationReports({ updateCount: +1 }));
        })
      )
      .subscribe();
  }

  updateReport(report: Report): void {
    this._reportApiService
      .updateReport(report)
      .pipe(
        tap(() => {
          showSuccessToast(this._toast);
          this._store.dispatch(ReportsActions.updateReport({ reportUpdated: report }));

          if (report.status === StatusReportEnum.Closed) {
            this._store.dispatch(UserActions.updateNotificationReports({ updateCount: -1 }));
          }
        })
      )
      .subscribe();
  }

  getCountGlobalReportsNotifications(): Observable<number> {
    return this._authStore.user$.pipe(
      map(user => {
        if (!user || !user.notification.reports) return 0;
        return user.notification.reports;
      })
    );
  }

  getAnalyseStatsByYear(reports: Report[]): ReportStatsAnalysis {
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

    const yearsOfStats = sorted.map(([year]) => year);
    const yearOptions = yearsOfStats.map(year => ({ label: year, value: year }));
    const selectedYear = yearOptions.length > 0 ? yearOptions[0].value : new Date().getFullYear();

    const countReportsUserByYear = sorted.map(([year, { reports }]) => ({ year, reports }));
    const countReporterUserByYear = sorted.map(([year, { reporters }]) => ({ year, uniqueReporters: reporters.size }));

    return {
      yearsOfStats,
      yearOptions,
      selectedYear,
      countReportsUserByYear,
      countReporterUserByYear,
    };
  }
}
