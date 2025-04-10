import { UUIDTypes } from 'uuid';

export type UserType = 'bénévole' | 'association';

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
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile_phone: string;
  city: string;
  country: string;
  birth_date: string;
  avatar?: {
    url: string;
  };
  followedAssociations: FollowedAssociation[];
  activitiesUserInfos: ActivitiesUserInfos[];
  geolocalisation: {
    latitude: number;
    longitude: number;
  };
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

type Address = {
  house_number: string;
  street_name: string;
  adress_suffix: string | null;
  zipCode: string;
  city: string;
  country: string;
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
  siret: string;
  name: string;
  email: string;
  password: string;
  mobile_phone: string;
  address: Address;
  associationLogoImage?: string;
  associationProfileImageURL?: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
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
