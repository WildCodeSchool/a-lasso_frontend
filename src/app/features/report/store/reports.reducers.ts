import { createReducer, on } from '@ngrx/store';
import { Report } from '../models/report.model';
import { ReportsActions } from './reports.actions';

export const initialReportsState: Report[] = [];

export const reportsReducer = createReducer(
  initialReportsState,

  on(ReportsActions.setReports, (state, { reports }) => {
    const incomingIds = new Set(reports.map(report => report.reportId));
    const remaining = state.filter(report => !incomingIds.has(report.reportId));
    return [...remaining, ...reports];
  }),

  on(ReportsActions.updateReport, (state, { reportUpdated }) =>
    state.map(report => (report.reportId === reportUpdated.reportId ? { ...report, ...reportUpdated } : report))
  )
);
