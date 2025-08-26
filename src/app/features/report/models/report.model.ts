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

export const reportTypeLabels: Record<ReportTypeEnum, string> = {
  [ReportTypeEnum.InappropriateActivity]: 'Activité inappropriée',
  [ReportTypeEnum.Harassment]: 'Harcèlement',
  [ReportTypeEnum.BadBehavior]: 'Comportement déplacé',
  [ReportTypeEnum.Other]: 'Autre',
};

export const reportTypeStatus: Record<StatusReportEnum, string> = {
  [StatusReportEnum.InProgress]: 'En cours',
  [StatusReportEnum.VoluntaryBanned]: 'Bénèv. Bannis',
  [StatusReportEnum.AssociationBanned]: 'Asso. bannis',
  [StatusReportEnum.Closed]: 'Clôturé',
};

export type ReportType = {
  label: string;
  value: string;
};

export type ReportUser = {
  id: UUIDTypes;
  userName: string;
  type?: 'association' | 'voluntary';
  email?: string;
};

export type Report = {
  reportedUser: ReportUser;
  messageReporter: string;
  reportType: ReportTypeEnum;
  hasLoadedAllReports?: boolean;
  reportId?: UUIDTypes;
  createdAt?: Date;
  status?: StatusReportEnum;
  commentaryAdmin?: string;
  reporterUser?: ReportUser;
};

export type ReportCountByYear = {
  year: number;
  reports: number;
};

export type ReporterCountByYear = {
  year: number;
  uniqueReporters: number;
};

export type ReportStatsAnalysis = {
  yearsOfStats: number[];
  yearOptions: { label: number; value: number }[];
  selectedYear: number;
  countReportsUserByYear: ReportCountByYear[];
  countReporterUserByYear: ReporterCountByYear[];
};

export type ReportsByUsers = {
  assocReports: Report[];
  volReports: Report[];
};
