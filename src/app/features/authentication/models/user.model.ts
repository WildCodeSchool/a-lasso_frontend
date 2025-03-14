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

type Adress = {
  house_number: string;
  street_name: string;
  adress_suffix: string;
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
  address: Adress;
};

export type UserLogin = {
  email: string;
  password: string;
};
