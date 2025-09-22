import { createAction, props } from '@ngrx/store';
import { Activity, Participant } from '../models/activity.model';
import { UUIDTypes } from 'uuid';

export * as ActivitiesActions from './activities.actions';

const ACTION_PREFIX = '[Activities]';

export const setActivities = createAction(`${ACTION_PREFIX} Set Activities`, props<{ activities: Activity[] }>());

export const setActivity = createAction(`${ACTION_PREFIX} Set Activity`, props<{ activity: Activity }>());

export const updateActivityParticipants = createAction(
  `${ACTION_PREFIX} Update Activity Participants`,
  props<{ id: UUIDTypes; participants: Participant }>()
);

export const updateActivitiesUserInfos = createAction(
  `${ACTION_PREFIX} Update Activities User Infos`,
  props<{
    activityId: UUIDTypes;
    isSaved?: boolean;
    isRegistered?: boolean;
  }>()
);

export const clearUserActivityInfos = createAction(`${ACTION_PREFIX} Clear User Activity Infos`);

export const deleteActivity = createAction(`${ACTION_PREFIX} Delete Activity`, props<{ activityId: UUIDTypes }>());

export const removeActivitiesByAssociation = createAction(
  '[Activities] Remove Activities By Association',
  props<{
    associationId: UUIDTypes;
  }>()
);
