export type Theme = 'Social' | 'Sport';

export type Association = {
  name: string;
  isFollow: boolean;
  logo: string;
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
  association: Association = { name: '', logo: '', isFollow: false };
  location: string = '';
  date: Date = new Date();
  participants: Participant = { current: 0, max: 10 };
  theme: Theme[];
  isFavorite: boolean = false;

  constructor(data: Partial<Activity> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.image = data.image || [];
    this.association = data.association || { name: '', logo: '', isFollow: false };
    this.location = data.location || '';
    this.date = data.date || new Date();
    this.participants = data.participants || { current: 0, max: 10 };
    this.theme = data.theme || [];
    this.isFavorite = data.isFavorite || false;
  }
}
