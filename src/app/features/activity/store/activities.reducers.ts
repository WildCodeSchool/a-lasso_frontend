import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/activity.model';
import * as ActivityActions from './activities.actions';

export const initialActivitiesState: Activity[] = [];

export const activitiesReducer = createReducer(
  initialActivitiesState,
  on(ActivityActions.setActivities, (_, { activities }) => [...activities]),

  on(ActivityActions.setActivity, (state, { activity }) => [...state, activity]),

  on(ActivityActions.updateActivityParticipants, (state, { id, participants }) =>
    state.map(activity => (activity.id === id ? { ...activity, participants } : activity))
  ),

  on(ActivityActions.clearUserActivityInfos, state =>
    state.map(activity => ({
      ...activity,
      isSaved: false,
      isRegistered: false,
    }))
  )
);
