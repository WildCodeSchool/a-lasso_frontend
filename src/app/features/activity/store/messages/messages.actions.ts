import { createAction, props } from '@ngrx/store';
import { Message } from '../../models/message.model';

export * as MessagesActions from './messages.actions';

const ACTION_PREFIX = '[Messages]';

export const setMessages = createAction(`${ACTION_PREFIX} Set Messages`, props<{ messages: Message[] }>());

export const addMessage = createAction(`${ACTION_PREFIX} Add Message`, props<{ message: Message }>());
