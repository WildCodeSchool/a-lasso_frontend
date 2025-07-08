export const EXPIRACY_MULTIPLIER = 1000;
export const ACTIVITY_LENGTH = 0;

export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  VOLUNTARY = 'ROLE_VOLUNTARY',
  ASSOCIATION = 'ROLE_ASSOCIATION',
}

export type TokenRole = {
  authority: UserRole;
};
