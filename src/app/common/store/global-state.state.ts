import { UserState } from 'src/app/features/authentication/models/user.model';
import { Activity } from '../../features/activity/models/activity.model';
import { Association } from 'src/app/features/association/models/association.model';
import { Message } from 'src/app/features/activity/models/message.model';

export type GlobalState = {
  activities: Activity[];
  associations: Association[];
  messages: Message[];
  user: UserState;
};

export const initialState: GlobalState = {
  activities: [],
  associations: [],
  messages: [],
  user: { userInfos: null, isAuthenticated: false, error: null },
};
