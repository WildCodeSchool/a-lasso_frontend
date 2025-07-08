import { createReducer, on } from '@ngrx/store';
import { updateReport, setReports } from './reports.actions';
import { Report } from '../models/report.model';

export const initialReportsState: Report[] = [];

export const reportsReducer = createReducer(
  initialReportsState,

  on(setReports, (state, { reports }) => {
    const incomingIds = new Set(reports.map(r => r.reportId));
    const remaining = state.filter(r => !incomingIds.has(r.reportId));
    return [...remaining, ...reports];
  }),

  on(updateReport, (state, { reportUpdated }) =>
    state.map(report => (report.reportId === reportUpdated.reportId ? { ...report, ...reportUpdated } : report))
  )
);
