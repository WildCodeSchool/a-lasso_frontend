import { UUIDTypes } from 'uuid';

export type MessageCreation = {
  content: string;
  activityId: UUIDTypes;
  date: Date;
};
