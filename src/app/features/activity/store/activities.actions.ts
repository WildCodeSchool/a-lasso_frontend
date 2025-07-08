import { createAction, props } from '@ngrx/store';
import { Activity, Participant } from '../models/activity.model';
import { UUIDTypes } from 'uuid';

export const setActivities = createAction('[activities] setActivities', props<{ activities: Activity[] }>());

export const setActivity = createAction('[activities] setActivity', props<{ activity: Activity }>());

export const updateActivityParticipants = createAction(
  '[activities] updateActivityParticipants',
  props<{ id: UUIDTypes; participants: Participant }>()
);

export const updateActivitiesUserInfos = createAction(
  '[activities] updateActivitiesUserInfos',
  props<{
    activityId: UUIDTypes;
    isSaved?: boolean;
    isRegistered?: boolean;
  }>()
);

export const clearUserActivityInfos = createAction('[Activity] Clear User Activity Infos');

export const deleteActivity = createAction('[Activity] Delete Activity', props<{ activityId: UUIDTypes }>());
