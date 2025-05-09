import { UUIDTypes } from 'uuid';

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
  associationProfileImageURL: string;
  associationLogoImage: string;
  siteURL: string;
  statistics: Statistic[];
};
