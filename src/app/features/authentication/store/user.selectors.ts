import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UUIDTypes } from 'uuid';
import { UserState, UserType } from '../models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, state => state.userInfos);

export const selectIsAuthenticated = createSelector(selectUserState, state => state.isAuthenticated);

export const selectLoginError = createSelector(selectUserState, state => state.error);

export const selectActivitiesUserInfos = createSelector(selectUser, user => (user && 'activitiesUserInfos' in user ? user.activitiesUserInfos : []));

export const selectFollowedAssociations = createSelector(selectUser, user =>
  user && 'followedAssociations' in user ? user.followedAssociations : []
);

export const selectConnectedAssociationId = createSelector(selectUser, (user): UUIDTypes | null => {
  return user.id;
});

export const selectConnectedVoluntaryId = createSelector(selectUser, user => (user?.type === UserType.Voluntary ? user.id : null));

export const selectAssociationFoundationDate = createSelector(selectUser, user => (user?.type === UserType.Association ? user.foundationDate : null));

export const selectAssociationFounder = createSelector(selectUser, user => (user?.type === UserType.Association ? user.founder : ''));

export const selectAssociationDescription = createSelector(selectUser, user => (user?.type === UserType.Association ? user.description : ''));

export const selectAssociationStats = createSelector(selectUser, user => (user?.type === UserType.Association ? user.statistics ?? [] : []));
