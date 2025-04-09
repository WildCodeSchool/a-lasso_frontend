export type ThemeNameEnum = 'Social' | 'Sport' | 'Santé' | 'Nature' | 'Culture' | 'Culinaire' | 'Cours';

export type Theme = {
  name: ThemeNameEnum;
  iconUrl: string;
};

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
  themesName: ThemeNameEnum[];
  isFavorite: boolean;
  isRegistered: boolean;
};
