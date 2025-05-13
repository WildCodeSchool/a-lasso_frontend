import { UUIDTypes } from 'uuid';

export type Column = {
  field: string;
  header: string;
};

export type TableData = Record<string, string | number | boolean | UUIDTypes>;
