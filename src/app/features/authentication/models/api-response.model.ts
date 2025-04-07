import { AssociationLogin, VoluntaryLogin } from './user.model';

export type ApiResponseLogin = {
  token: string;
  user: VoluntaryLogin | AssociationLogin;
};

export type JwtDecodedToken = {
  exp: number;
  iat?: number;
  sub?: string;
  roles?: string[];
};
