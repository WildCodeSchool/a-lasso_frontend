import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Report } from '../models/report.model';
import { UUIDTypes } from 'uuid';

export * as ReportsSelectors from './reports.selectors';

export const selectReportsState = createFeatureSelector<Report[]>('reports');

export const selectReports = createSelector(selectReportsState, reports => reports);

export const selectReportsById = (reportId: UUIDTypes): MemoizedSelector<object, Report[]> =>
  createSelector(selectReportsState, (reports: Report[]) => {
    const report = reports.find(r => r.reportId === reportId);
    if (report) {
      const reportedId = report.reportedUser.id;
      return reports.filter(r => r.reportedUser.id === reportedId);
    }
    return [];
  });
