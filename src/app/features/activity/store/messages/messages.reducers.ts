import { createReducer, on } from '@ngrx/store';
import { addMessage, setMessages } from './messages.actions';
import { Message } from '../../models/message.model';

export const initialMessagesState: Message[] = [];

export const messagesReducer = createReducer(
  initialMessagesState,
  on(setMessages, (_, { messages }) => [...messages]),
  on(addMessage, (state, { message }) => [...state, message])
);
