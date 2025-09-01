export const MIN_LENGTH = 2;
export const MAX_LENGTH = 50;
export const ASSOCIATION_DESCRIPTION_MIN_LENGTH = 20;
export const ASSOCIATION_DESCRIPTION_MAX_LENGTH = 200;
export const ACTIVITY_DESCRIPTION_MAX_LENGTH = 1000;
export const MAX_ADDRESS_LENGTH = 100;
export const INITIAL_CARDS_COUNT = 0;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/;
export const SIRET_REGEX = /^\d{14}$/;
export const PHONE_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/;
export const POSTAL_CODE_REGEX = /^\d{5}$/;
export const ADDRESS_NUMBER_REGEX = /^\d+[a-zA-Z]?$/;

export const DATE_PAD_LENGTH = 2;
export const MONTH_OFFSET = 1;
export const HOUR_REGEX = /^\d{2}:\d{2}$/; // 06:00
export const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/; // 15/06/2025

export const NUMBER_REGEX = /^\d+$/;
export const HOUSE_NUMBER_REGEX = /^(\d+)\s+(.*)$/;
