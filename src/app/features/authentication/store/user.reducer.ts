import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './user.actions';
import { FollowedAssociation, UserState, VoluntaryLogin } from '../models/user.model';
import { getInitialUserState } from './meta-reducers';

export const initialState: UserState = getInitialUserState();

export const userReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({
    ...state,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos,
    isAuthenticated: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    userInfos: null,
    isAuthenticated: false,
    error,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.updateFollowedAssociations, (state, { associationId, isFollow }) => {
    if (!state.userInfos || !('followedAssociations' in state.userInfos)) {
      return state;
    }

    const existing = state.userInfos.followedAssociations as FollowedAssociation[];

    const updated = isFollow
      ? [...existing.filter(a => a.associationId !== associationId), { associationId, isFollow: true, isNotificationActive: true }]
      : existing.filter(a => a.associationId !== associationId);

    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        followedAssociations: updated,
      } as VoluntaryLogin,
    };
  }),
  on(AuthActions.updateActivitiesUserInfos, (state, { activityId, isSaved, isRegistered }) => {
    if (!state.userInfos || !('activitiesUserInfos' in state.userInfos)) {
      return state;
    }

    const existing = state.userInfos.activitiesUserInfos;

    const updated = existing.map(activity => {
      if (activity.activityId === activityId) {
        return {
          ...activity,
          isSaved: typeof isSaved !== 'undefined' ? isSaved : activity.isSaved,
          isRegistered: typeof isRegistered !== 'undefined' ? isRegistered : activity.isRegistered,
        };
      }
      return activity;
    });

    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        activitiesUserInfos: updated,
      } as VoluntaryLogin,
    };
  })
);
