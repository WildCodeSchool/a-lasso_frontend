import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Report } from '../models/report.model';

export const selectReportsState = createFeatureSelector<Report[]>('reports');

export const selectReports = createSelector(selectReportsState, reports => reports);
