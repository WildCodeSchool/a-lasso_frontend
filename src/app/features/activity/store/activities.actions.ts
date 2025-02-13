import { createAction, props } from '@ngrx/store';
import { Activity } from '../models/activity.model';

export const setActivities = createAction('[activities] setActivities', props<{ activities: Activity[] }>());
