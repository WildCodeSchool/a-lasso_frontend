import { Activity } from '../../features/activity/models/activity.model';

export type GlobalState = {
  activities: Activity[];
};

export const initialState: GlobalState = { activities: [] };
