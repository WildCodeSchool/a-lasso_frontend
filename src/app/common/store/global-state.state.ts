import { UserState } from 'src/app/features/authentication/models/user.model';
import { Activity } from '../../features/activity/models/activity.model';
import { Association } from 'src/app/features/association/models/association.model';
import { Message } from 'src/app/features/activity/models/message.model';
import { Report } from '../../features/report/models/report.model';

export type GlobalState = {
  activities: Activity[];
  associations: Association[];
  messages: Message[];
  reports: Report[];
  user: UserState;
};

export const initialState: GlobalState = {
  activities: [],
  associations: [],
  messages: [],
  reports: [],
  user: { userInfos: null, isAuthenticated: false, error: null },
};
