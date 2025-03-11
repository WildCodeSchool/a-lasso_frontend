import { UUIDTypes } from 'uuid';

export type Statistic = {
  value: number;
  description: string;
};

export class Association {
  id: UUIDTypes;
  description: string;
  founder: string;
  LocalDate: Date;
  name: string;
  associationProfileImageURL: string;
  associationLogoImage: string;
  siteURL: string;
  statistics: Statistic[];
  isFollow: boolean;

  constructor(data: Partial<Association>) {
    this.id = data.id || '';
    this.description = data.description || '';
    this.founder = data.founder || '';
    this.LocalDate = data.LocalDate || new Date();
    this.name = data.name || '';
    this.associationProfileImageURL = data.associationProfileImageURL || '';
    this.associationLogoImage = data.associationLogoImage || '';
    this.siteURL = data.siteURL || '';
    this.statistics = data.statistics || [{ value: 0, description: '' }];
    this.isFollow = data.isFollow || false;
  }
}
