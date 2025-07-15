import { UUIDTypes } from 'uuid';
import { Localisation, ThemeName } from './activity.model';
import { Address } from '../../authentication/models/user.model';

export enum ActivityStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export type Image = {
  id: UUIDTypes | null;
  base64: string;
};

export type ActivityFormData = {
  id: UUIDTypes | null;
  status: ActivityStatusEnum;
  images: Image[];
  title: string;
  requestedVolunteers: number;
  dateTime: string; // "yyyy-MM-dd'T'HH:mm:ss"
  address: Address;
  location: Localisation;
  themes: ThemeName[];
  description: string;
};
