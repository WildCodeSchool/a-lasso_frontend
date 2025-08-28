import { createReducer, on } from '@ngrx/store';
import { AssociationLogin, FollowedAssociation, MessageNotification, UserState, UserType, VoluntaryLogin } from '../models/user.model';
import { getInitialUserState } from './meta-reducers';
import { UserActions } from './user.actions';

export const initialState: UserState = getInitialUserState();

export const userReducer = createReducer(
  initialState,
  on(UserActions.login, state => ({
    ...state,
    error: null,
  })),
  on(UserActions.loginSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos,
    isAuthenticated: true,
    error: null,
  })),
  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    userInfos: null,
    isAuthenticated: false,
    error,
  })),
  on(UserActions.logout, () => initialState),
  on(UserActions.updateFollowedAssociations, (state, { associationId, isFollow }) => {
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
  on(UserActions.updateActivitiesUserInfos, (state, { activityId, isSaved, isRegistered }) => {
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

  on(UserActions.setNotificationMessages, (state, { activityId }) => {
    const userInfos: VoluntaryLogin | AssociationLogin = state.userInfos;

    if (!userInfos || !('notification' in userInfos)) {
      return state;
    }

    const updatedMessages: MessageNotification[] = userInfos.notification.messages.map((m: MessageNotification) =>
      m.activityId === activityId ? { ...m, countMessagesNotRead: 0 } : m
    );

    return {
      ...state,
      userInfos: {
        ...userInfos,
        notification: {
          ...userInfos.notification,
          messages: updatedMessages,
        },
      },
    };
  }),

  on(UserActions.updateNotificationReports, (state, { updateCount }) => {
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

  on(UserActions.updateAssociationStats, (state, { statistics }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        statistics,
      },
    };
  }),

  on(UserActions.updateAssociationDescription, (state, { description }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        description,
      },
    };
  }),

  on(UserActions.updateAssociationGeneralInfo, (state, { foundationDate, founder }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        foundationDate,
        founder,
      },
    };
  }),

  on(UserActions.updateAssociationLogo, (state, { associationLogoImage }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        associationLogoImage,
      },
    };
  }),

  on(UserActions.updateAssociationCover, (state, { associationProfileImage }) => {
    if (!state.userInfos || state.userInfos.type !== UserType.Association) return state;
    return {
      ...state,
      userInfos: {
        ...state.userInfos,
        associationProfileImage,
      },
    };
  })
);
