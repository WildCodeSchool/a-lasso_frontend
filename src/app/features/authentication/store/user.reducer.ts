import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './user.actions';
import { FollowedAssociation, UserState, UserType, VoluntaryLogin } from '../models/user.model';
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
      ? [
          ...existing.filter(a => a.associationId !== associationId),
          {
            associationId,
            isFollow: true,
            isNotificationActive: true,
          },
        ]
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
    let found: boolean = false;

    const updated = existing.map(activity => {
      if (activity.activityId === activityId) {
        found = true;
        return {
          ...activity,
          isSaved: typeof isSaved !== 'undefined' ? isSaved : activity.isSaved,
          isRegistered: typeof isRegistered !== 'undefined' ? isRegistered : activity.isRegistered,
        };
      }
      return activity;
    });

    if (!found) {
      updated.push({
        activityId,
        isSaved: isSaved ?? false,
        isRegistered: isRegistered ?? false,
      });
    }

    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        activitiesUserInfos: updated,
      } as VoluntaryLogin,
    };
  }),

  on(AuthActions.setNotificationMessages, (state, { activityId }) => ({
    ...state,
    userInfos:
      state.userInfos && 'notification' in state.userInfos
        ? {
            ...state.userInfos,
            notification: {
              ...state.userInfos.notification,
              messages: state.userInfos.notification.messages.map(n =>
                n.activityId === activityId
                  ? {
                      ...n,
                      countMessagesNotRead: 0,
                    }
                  : n
              ),
            },
          }
        : state.userInfos,
  })),

  on(AuthActions.updateNotificationReports, (state, { updateCount }) => {
    if (!state.userInfos || !('notification' in state.userInfos)) {
      return state;
    }

    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        notification: {
          ...state.userInfos.notification,
          reports: state.userInfos.notification.reports !== null ? state.userInfos.notification.reports + updateCount : 0,
        },
      },
    };
  }),

  on(AuthActions.updateAssociationStats, (state, { statistics }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        statistics,
      },
    };
  }),

  on(AuthActions.updateAssociationDescription, (state, { description }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        description,
      },
    };
  }),

  on(AuthActions.updateAssociationGeneralInfo, (state, { foundationDate, founder }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        foundationDate,
        founder,
      },
    };
  })
);
