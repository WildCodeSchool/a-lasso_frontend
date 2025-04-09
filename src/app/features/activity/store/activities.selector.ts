import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Activity } from '../models/activity.model';
import { UUIDTypes } from 'uuid';

export const selectActivitiesState = createFeatureSelector<Activity[]>('activities');
export const selectActivities = createSelector(selectActivitiesState, activities => activities);

export const selectActivityById = (activityId: UUIDTypes): MemoizedSelector<object, Activity> =>
  createSelector(selectActivitiesState, activities => (activities || []).find(item => item.id === activityId) || ({} as Activity));
