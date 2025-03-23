import { createAction, props } from '@ngrx/store';
import { Message } from '../../models/message.model';

export const setMessages = createAction('[messages] setMessages', props<{ messages: Message[] }>());

export const addMessage = createAction('[messages] addMessage', props<{ message: Message }>());
