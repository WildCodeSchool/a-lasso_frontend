export type Theme = 'Social' | 'Sport';

export type Organization = {
  name: string;
  isFollow: boolean;
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
  organization: Organization = { name: '', isFollow: false };
  location: string = '';
  date: Date = new Date();
  participant: Participant = { current: 0, max: 10 };
  theme: Theme[];
  isFavorite: boolean = false;

  constructor(
    id: string,
    title: string,
    description: string,
    image: string[],
    organization: Organization,
    location: string,
    date: Date,
    participant: Participant,
    theme: Theme[],
    isFavorite: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.organization = organization;
    this.location = location;
    this.date = date;
    this.participant = participant;
    this.theme = theme;
    this.isFavorite = isFavorite;
  }
}
