import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/activity.model';
import { ActivitiesActions } from './activities.actions';

export const initialActivitiesState: Activity[] = [];

export const activitiesReducer = createReducer(
  initialActivitiesState,
  on(ActivitiesActions.setActivities, (_, { activities }) => [...activities]),

  on(ActivitiesActions.setActivity, (state, { activity }) => [...state, activity]),

  on(ActivitiesActions.updateActivityParticipants, (state, { id, participants }) =>
    state.map(activity => (activity.id === id ? { ...activity, participants } : activity))
  ),

  on(ActivitiesActions.clearUserActivityInfos, state =>
    state.map(activity => ({
      ...activity,
      isSaved: false,
      isRegistered: false,
    }))
  ),

  on(ActivitiesActions.deleteActivity, (state, { activityId }) => state.filter(activity => activity.id !== activityId))
);
