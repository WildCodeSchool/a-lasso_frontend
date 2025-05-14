import { UUIDTypes } from 'uuid';
import { ThemeName } from './activity.model';
import { Address } from '../../authentication/models/user.model';

type Image = {
  id: UUIDTypes | null;
  base64: string;
};

export type NewActivityCreation = {
  images: Image[];
  title: string;
  requestedVolunteers: number;
  dateTime: string; // "yyyy-MM-dd'T'HH:mm:ss"
  address: Address;
  themes: ThemeName[];
  description: string;
};
