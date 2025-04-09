export type Theme = 'Social' | 'Sport' | 'Santé' | 'Nature' | 'Culture' | 'Culinaire' | 'Cours';

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
  theme: Theme[];
  isFavorite: boolean;
  isRegistered: boolean;
};
