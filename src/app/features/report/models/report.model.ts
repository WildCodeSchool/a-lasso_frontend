import { UUIDTypes } from 'uuid';

export enum StatusReportEnum {
  InProgress = 'IN_PROGRESS',
  VoluntaryBanned = 'VOLUNTARY_BANNED',
  AssociationBanned = 'ASSOCIATION_BANNED',
  Closed = 'CLOSED',
}

export enum ReportTypeEnum {
  InappropriateActivity = 'INAPPROPRIATE_ACTIVITY',
  Harassment = 'HARASSMENT',
  BadBehavior = 'BAD_BEHAVIOR',
  Other = 'OTHER',
}

export type ReportType = {
  label: string;
  value: string;
};

export type ReportUser = {
  id: UUIDTypes;
  userName: string;
};

export type Report = {
  reportedUser: ReportUser;
  messageReporter: string;
  reportType: ReportTypeEnum;
  createdAt?: Date;
  status?: StatusReportEnum;
  commentaryAdmin?: string;
  reporterUser?: ReportUser;
};
