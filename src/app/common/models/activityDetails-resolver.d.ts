import { Activity } from 'src/app/features/activity/models/activity.model';
import { Association } from 'src/app/features/association/models/association.model';

export type ActivityDetailsResolver = {
  activity: Activity;
  association: Association;
};
