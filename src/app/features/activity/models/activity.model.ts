import { ThemeName } from './theme.model';

export type Localisation = {
  city: string;
  longitude: number;
  latitude: number;
};

export type AssociationActivity = {
  id: string;
  name: string;
  isFollow: boolean;
  logo: string;
  localisation: Localisation;
};

export type Participant = {
  current: number;
  max: number;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  images: string[];
  association: AssociationActivity;
  location: Localisation;
  date: Date;
  participants: Participant;
  theme: ThemeName[];
  isFavorite: boolean;
  isRegistered: boolean;
};
