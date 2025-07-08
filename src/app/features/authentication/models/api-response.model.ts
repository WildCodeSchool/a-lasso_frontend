import { AssociationLogin, VoluntaryLogin } from './user.model';
import { TokenRole } from '../constants/auth.constants';

export type ApiResponseLogin = {
  token: string;
  user: VoluntaryLogin | AssociationLogin;
};

export type JwtDecodedToken = {
  exp: number;
  iat?: number;
  sub?: string;
  roles?: TokenRole[];
};
