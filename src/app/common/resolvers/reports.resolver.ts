import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportFacadeService } from '../../features/report/services/report-facade.service';
import { inject } from '@angular/core';
import { Report } from '../../features/report/models/report.model';

export const reportsResolver: ResolveFn<Report[]> = (): Observable<Report[]> => {
  const reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  return reportFacadeService.getReportsFromStore$();
};
