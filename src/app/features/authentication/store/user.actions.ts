import { createAction, props } from '@ngrx/store';
import { AssociationLogin, UserLogin, VoluntaryLogin } from '../models/user.model';
import { UUIDTypes } from 'uuid';
import { Statistic } from '../../association/models/association.model';

export * as UserActions from './user.actions';

const ACTION_PREFIX = '[User]';

export const login = createAction(`${ACTION_PREFIX} Login`, props<{ credentials: UserLogin }>());

export const loginSuccess = createAction(
  `${ACTION_PREFIX} Login Success`,
  props<{
    userInfos: VoluntaryLogin | AssociationLogin;
  }>()
);

export const loginFailure = createAction(`${ACTION_PREFIX} Login Failure`, props<{ error: string }>());

export const logout = createAction(`${ACTION_PREFIX} Logout`);

export const updateFollowedAssociations = createAction(
  `${ACTION_PREFIX} Update Followed Associations`,
  props<{
    associationId: UUIDTypes;
    isFollow: boolean;
    isNotificationActive?: boolean;
  }>()
);

export const updateActivitiesUserInfos = createAction(
  `${ACTION_PREFIX} Update Activities User Infos`,
  props<{
    activityId: UUIDTypes;
    isSaved?: boolean;
    isRegistered?: boolean;
  }>()
);

export const setNotificationMessages = createAction(
  `${ACTION_PREFIX} Update Notification Messages`,
  props<{
    activityId: UUIDTypes;
  }>()
);

export const updateNotificationReports = createAction(
  `${ACTION_PREFIX} Update Notification Reports`,
  props<{
    updateCount: number;
  }>()
);

export const updateAssociationGeneralInfo = createAction(
  `${ACTION_PREFIX} Update Association General Info`,
  props<{ foundationDate: string; founder: string }>()
);

export const updateAssociationDescription = createAction(`${ACTION_PREFIX} Update Association Description`, props<{ description: string }>());

export const updateAssociationStats = createAction(`${ACTION_PREFIX} Update Association Stats`, props<{ statistics: Statistic[] }>());
