export enum ThemeName {
  Social = 'Social',
  Sport = 'Sport',
  Santé = 'Santé',
  Nature = 'Nature',
  Culture = 'Culture',
  Culinaire = 'Culinaire',
  Cours = 'Cours',
}

export type Theme = {
  name: ThemeName;
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
  themesName: ThemeName[];
};

export type ActivitySearchFilters = {
  search: string;
  date: string;
  location: string;
};
