import { inject, Injectable } from '@angular/core';
import { ReportApiService } from './report-api.service';
import { Report, StatusReportEnum } from '../models/report.model';
import { Observable, of, switchMap, tap } from 'rxjs';
import { MessageService as Toast } from 'primeng/api';
import { Store } from '@ngrx/store';
import { selectReports, selectReportsById } from '../store/reports.selector';
import { setReports, updateReport } from '../store/reports.actions';
import { updateNotificationReports } from '../../authentication/store/user.actions';

@Injectable({
  providedIn: 'root',
})
export class ReportFacadeService {
  private _toast: Toast = inject(Toast);
  private _store: Store = inject(Store);
  private readonly _reportApiService: ReportApiService = inject(ReportApiService);

  getReportsFromApi(): Observable<Report[]> {
    return this._reportApiService.getReportsFromApi().pipe(
      tap((reports: Report[]) => {
        this._store.dispatch(setReports({ reports: reports }));
      })
    );
  }

  getReportsFromStore$(): Observable<Report[]> {
    return this._store.select(selectReports).pipe(
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
      return this._store.select(selectReportsById(report.reportId));
    }

    return this._reportApiService.getReportsByReportedIdFromApi(report.reportedUser.id).pipe(
      tap((reports: Report[]) => {
        const updatedReports: Report[] = reports.map(report => ({
          ...report,
          hasLoadedAllReports: true,
        }));
        this._store.dispatch(setReports({ reports: updatedReports }));
      })
    );
  }

  sendReport(report: Report): void {
    this._reportApiService
      .sendReport(report)
      .pipe(
        tap(() => {
          this._toast.add({
            severity: 'success',
            summary: 'Signalement envoyé !',
          });
          this._store.dispatch(updateNotificationReports({ updateCount: +1 }));
        })
      )
      .subscribe();
  }

  updateReport(report: Report): void {
    this._reportApiService
      .updateReport(report)
      .pipe(
        tap(() => {
          this._toast.add({
            severity: 'success',
            summary: `${report.status === StatusReportEnum.Closed ? 'Signalement clôturé' : 'Signalement mis à jour !'}`,
          });
          this._store.dispatch(updateReport({ reportUpdated: report }));

          if (report.status === StatusReportEnum.Closed) {
            this._store.dispatch(updateNotificationReports({ updateCount: -1 }));
          }
        })
      )
      .subscribe();
  }
}
