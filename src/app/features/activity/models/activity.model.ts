export type Theme = 'Social' | 'Sport' | 'Santé' | 'Nature' | 'Culture' | 'Culinaire' | 'Cours';

export type Localisation = {
  city: string;
  longitude: number;
  latitude: number;
};

export type AssociationActiviy = {
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

export class Activity {
  id: string = '';
  title: string = '';
  description: string = '';
  image: string[] = [];
  association: AssociationActiviy = {
    id: '',
    name: '',
    logo: '',
    isFollow: false,
    localisation: {
      city: '',
      longitude: 0,
      latitude: 0,
    },
  };
  location: Localisation = {
    city: '',
    longitude: 0,
    latitude: 0,
  };
  date: Date = new Date();
  participants: Participant = { current: 0, max: 10 };
  theme: Theme[];
  isFavorite: boolean = false;

  constructor(data: Partial<Activity> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.image = data.image || [];
    this.association = data.association || {
      id: '',
      name: '',
      logo: '',
      isFollow: false,
      localisation: {
        city: '',
        longitude: 0,
        latitude: 0,
      },
    };
    this.location = data.location || {
      city: '',
      longitude: 0,
      latitude: 0,
    };
    this.date = data.date || new Date();
    this.participants = data.participants || { current: 0, max: 10 };
    this.theme = data.theme || [];
    this.isFavorite = data.isFavorite || false;
  }
}
