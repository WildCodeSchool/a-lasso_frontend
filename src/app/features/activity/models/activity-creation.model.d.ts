import { UUIDTypes } from 'uuid';
import { ThemeName } from './activity.model';

type Image = {
  id: UUIDTypes | null;
  base64: string;
};

export type NewActivityCreation = {
  associationId: UUIDTypes;
  images: Images[];
  title: string;
  requestedVolunteers: number;
  date: string;
  hour: string;
  zipCode: string;
  city: string;
  themes: ThemeName[];
  description: string;
};
