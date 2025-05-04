import { createAction, props } from '@ngrx/store';
import { Report } from '../models/report.model';

export const setReports = createAction('[reports] setReports', props<{ reports: Report[] }>());
