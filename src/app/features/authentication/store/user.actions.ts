import { createAction, props } from '@ngrx/store';
import { AssociationLogin, UserLogin, VoluntaryLogin } from '../models/user.model';
import { UUIDTypes } from 'uuid';
import { Statistic } from '../../association/models/association.model';

export const login = createAction('[User] Login', props<{ credentials: UserLogin }>());

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{
    userInfos: VoluntaryLogin | AssociationLogin;
  }>()
);

export const loginFailure = createAction('[User] Login Failure', props<{ error: string }>());

export const logout = createAction('[User] Logout');

export const updateFollowedAssociations = createAction(
  '[User] Update Followed Associations',
  props<{
    associationId: UUIDTypes;
    isFollow: boolean;
    isNotificationActive?: boolean;
  }>()
);

export const updateActivitiesUserInfos = createAction(
  '[User] Update Activities User Infos',
  props<{
    activityId: UUIDTypes;
    isSaved?: boolean;
    isRegistered?: boolean;
  }>()
);

export const setNotificationMessages = createAction(
  '[User] Update Notification Messages',
  props<{
    activityId: UUIDTypes;
  }>()
);

export const setNotificationReports = createAction('[User] Update Notification Reports');

export const updateAssociationGeneralInfo = createAction(
  '[User] Update Association General Info',
  props<{ foundationDate: string; founder: string }>()
);

export const updateAssociationDescription = createAction('[User] Update Association Description', props<{ description: string }>());

export const updateAssociationStats = createAction('[User] Update Association Stats', props<{ statistics: Statistic[] }>());
