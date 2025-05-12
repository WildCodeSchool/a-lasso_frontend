import { createReducer, on } from '@ngrx/store';
import { deleteReport, setReports } from './reports.actions';
import { Report } from '../models/report.model';

export const initialReportsState: Report[] = [];

export const reportsReducer = createReducer(
  initialReportsState,

  on(setReports, (_, { reports }) => [...reports]),

  on(deleteReport, (state, { reportId }) => state.filter(report => report.reportId !== reportId))
);
