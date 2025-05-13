import { inject, Injectable } from '@angular/core';
import { ReportApiService } from './report-api.service';
import { Report } from '../models/report.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { MessageService as Toast } from 'primeng/api';
import { Store } from '@ngrx/store';
import { selectReports } from '../store/reports.selector';
import { TAKE_1 } from '../../../common/constants/observables.constants';
import { deleteReport, setReports } from '../store/reports.actions';
import { UUIDTypes } from 'uuid';
import { setNotificationReports } from '../../authentication/store/user.actions';

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
      take(TAKE_1),
      switchMap(reports => {
        if (reports.length > 0) {
          return of(reports);
        }
        return this.getReportsFromApi();
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
        })
      )
      .subscribe();
  }

  closeReport(reportId: UUIDTypes): void {
    this._reportApiService
      .closeReport(reportId)
      .pipe(
        tap(() => {
          this._toast.add({
            severity: 'success',
            summary: 'Signalement clos !',
          });

          this._store.dispatch(deleteReport({ reportId }));

          this._store.dispatch(setNotificationReports());
        })
      )
      .subscribe();
  }
}
