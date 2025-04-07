import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/activity.model';
import { setActivities, setThemes, updateActivityParticipants, updateFavoriteStatus, updateRegisterStatus } from './activities.actions';
import { Theme } from '../models/theme.model';

export const initialThemesState: Theme[] = [];
export const initialActivitiesState: Activity[] = [];

export const activitiesReducer = createReducer(
  initialActivitiesState,
  on(setActivities, (_, { activities }) => [...activities]),

  on(updateFavoriteStatus, (state, { id, isFavorite }) => state.map(activity => (activity.id === id ? { ...activity, isFavorite } : activity))),

  on(updateRegisterStatus, (state, { id, isRegistered }) => state.map(activity => (activity.id === id ? { ...activity, isRegistered } : activity))),

  on(updateActivityParticipants, (state, { id, participants }) =>
    state.map(activity => (activity.id === id ? { ...activity, participants } : activity))
  )
);

export const themesReducer = createReducer(
  initialThemesState,
  on(setThemes, (_, { themes }) => [...themes])
);
