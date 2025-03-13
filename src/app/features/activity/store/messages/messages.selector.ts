import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { UUIDTypes } from 'uuid';
import { Message } from '../../models/message.model';

export const selectMessagesState = createFeatureSelector<Message[]>('messages');

export const selectMessages = createSelector(selectMessagesState, messages => messages);

export const selectMessagesByActivityId = (activityId: UUIDTypes): MemoizedSelector<object, Message[]> =>
  createSelector(selectMessagesState, messages => messages?.filter(item => item.activityId === activityId) || []);
