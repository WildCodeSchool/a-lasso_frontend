import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, state => state.userInfos);

export const selectIsAuthenticated = createSelector(selectUserState, state => state.isAuthenticated);

export const selectLoginError = createSelector(selectUserState, state => state.error);

export const selectActivitiesUserInfos = createSelector(selectUser, user => (user && 'activitiesUserInfos' in user ? user.activitiesUserInfos : []));

export const selectFollowedAssociations = createSelector(selectUser, user =>
  user && 'followedAssociations' in user ? user.followedAssociations : []
);
