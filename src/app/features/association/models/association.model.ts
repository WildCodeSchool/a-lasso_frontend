import { UUIDTypes } from 'uuid';
import { Image } from '../../activity/models/activity.model';

export type Statistic = {
  value: number;
  description: string;
};

export type Association = {
  id: UUIDTypes;
  description: string;
  founder: string;
  foundationDate: Date;
  name: string;
  associationProfileImage: Image;
  associationLogoImage: Image;
  siteURL: string;
  statistics: Statistic[];
};
