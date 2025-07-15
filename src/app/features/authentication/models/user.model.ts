import { UUIDTypes } from 'uuid';
import { Image, Localisation } from '../../activity/models/activity.model';
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
  displayName: string;
  latitude: string;
  longitude: string;
  address?: {
    houseNumber?: string;
    road?: string;
    postCode?: string;
    city?: string;
    state?: string;
    country?: string;
    countryCode?: string;
  };
};

export type Address = {
  houseNumber: string;
  streetName: string;
  zipCode: string;
  city: string;
  country: string;
  displayName: string;
};

export type AssociationRegister = {
  siret: string;
  name: string;
  email: string;
  password: string;
  mobile_phone: string;
  address: Address;
  location: Localisation;
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

export type UserHeaderInfo = {
  isConnected: boolean;
  canPublishActivity: boolean;
  userDisplayName: string;
};
