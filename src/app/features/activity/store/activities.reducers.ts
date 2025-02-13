import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/activity.model';
import { setActivities } from './activities.actions';

export const initialActivitiesState: Activity[] = [];

export const activitiesReducer = createReducer(
  initialActivitiesState,
  on(setActivities, (_, { activities }) => [...activities])
);
