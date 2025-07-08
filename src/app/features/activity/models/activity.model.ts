import { UUIDTypes } from 'uuid';
import { NavigationItems } from '../../../common/models/toggle-menu';

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

export type Image = {
  id?: UUIDTypes;
  image: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  images: Image[];
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

export type ActivityDetailsNavigation = {
  tabs: NavigationItems[];
  chosen: string;
  activeTabIndex: number;
};
