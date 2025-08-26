import { createReducer, on } from '@ngrx/store';
import { Message } from '../../models/message.model';
import { MessagesActions } from './messages.actions';

export const initialMessagesState: Message[] = [];

export const messagesReducer = createReducer(
  initialMessagesState,
  on(MessagesActions.setMessages, (_, { messages }) => [...messages]),
  on(MessagesActions.addMessage, (state, { message }) => [...state, message])
);
