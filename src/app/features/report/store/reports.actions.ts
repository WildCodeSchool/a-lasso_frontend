import { createAction, props } from '@ngrx/store';
import { Report } from '../models/report.model';

export * as ReportsActions from './reports.actions';

const ACTION_PREFIX = '[Reports]';

export const setReports = createAction(`${ACTION_PREFIX} Set Reports`, props<{ reports: Report[] }>());

export const updateReport = createAction(`${ACTION_PREFIX} Update Report`, props<{ reportUpdated: Report }>());
