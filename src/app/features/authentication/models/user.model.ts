import { UUIDTypes } from 'uuid';
import { Image } from '../../activity/models/activity.model';
import { Statistic } from '../../association/models/association.model';

export enum UserType {
  Association = 'association',
  Voluntary = 'voluntary',
}

export type VoluntaryRegister = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile_phone: string;
  city: string;
  country: string;
  birth_date: string;
};

export type VoluntaryLogin = {
  id: UUIDTypes;
  type: UserType.Voluntary;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile_phone: string;
  city: string;
  country: string;
  birth_date: string;
  avatar?: Image;
  followedAssociations: FollowedAssociation[];
  activitiesUserInfos: ActivitiesUserInfos[];
  notification: Notification;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
};

export type Notification = {
  messages: MessageNotification[];
  reports: number | null;
};

export type MessageNotification = {
  activityId: UUIDTypes;
  activityTitle: string;
  countMessagesNotRead: number;
};

export type FollowedAssociation = {
  associationId: UUIDTypes;
  isFollow: boolean;
  isNotificationActive: boolean;
};

export type ActivitiesUserInfos = {
  activityId: UUIDTypes;
  isSaved: boolean;
  isRegistered: boolean;
};

export type AddressApiResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
};

export type Address = {
  houseNumber: string;
  streetName: string;
  zipCode: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export type AssociationRegister = {
  siret: string;
  name: string;
  email: string;
  password: string;
  mobile_phone: string;
  address: Address;
};

export type AssociationLogin = {
  id: UUIDTypes;
  type: UserType.Association;
  siret: string;
  name: string;
  email: string;
  password: string;
  mobile_phone: string;
  address: Address;
  associationLogoImage?: Image;
  associationProfileImage?: Image;
  notification: Notification;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  foundationDate: string;
  founder: string;
  description: string;
  statistics?: Statistic[];
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserState = {
  userInfos: VoluntaryLogin | AssociationLogin | null;
  isAuthenticated: boolean;
  error: string | null;
};
