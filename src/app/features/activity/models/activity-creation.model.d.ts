import { UUIDTypes } from 'uuid';
import { ThemeName } from './activity.model';

type Image = {
  id: UUIDTypes | null;
  base64: string;
};

export type NewActivityCreation = {
  images: Image[];
  title: string;
  requestedVolunteers: number;
  dateTime: string; // "yyyy-MM-dd'T'HH:mm:ss"
  houseNumber: number;
  streetName: string;
  zipCode: string;
  city: string;
  country: string;
  themes: ThemeName[];
  description: string;
};
