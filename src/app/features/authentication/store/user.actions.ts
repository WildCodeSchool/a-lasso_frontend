import { createAction, props } from '@ngrx/store';
import { AssociationLogin, UserLogin, VoluntaryLogin } from '../models/user.model';
import { UUIDTypes } from 'uuid';

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
