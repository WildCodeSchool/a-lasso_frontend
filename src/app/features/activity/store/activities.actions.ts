import { createAction, props } from '@ngrx/store';
import { Activity, Participant } from '../models/activity.model';
import { UUIDTypes } from 'uuid';
import { Theme } from '../models/theme.model';

export const setThemes = createAction('[themes] setThemes', props<{ themes: Theme[] }>());
export const setActivities = createAction('[activities] setActivities', props<{ activities: Activity[] }>());

export const updateFavoriteStatus = createAction('[activities] updateFavoriteStatus', props<{ id: UUIDTypes; isFavorite: boolean }>());

export const updateRegisterStatus = createAction('[activities] updateRegisterStatus', props<{ id: UUIDTypes; isRegistered: boolean }>());

export const updateActivityParticipants = createAction(
  '[activities] updateActivityParticipants',
  props<{ id: UUIDTypes; participants: Participant }>()
);
