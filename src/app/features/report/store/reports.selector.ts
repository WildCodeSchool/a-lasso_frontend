import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Report } from '../models/report.model';
import { UUIDTypes } from 'uuid';

export const selectReportsState = createFeatureSelector<Report[]>('reports');

export const selectReports = createSelector(selectReportsState, reports => reports);

export const selectCommentaryAdmin = (reportId: UUIDTypes): MemoizedSelector<object, string | null> =>
  createSelector(selectReportsState, reports => (reports || []).find(item => item.reportId === reportId).commentaryAdmin || null);
