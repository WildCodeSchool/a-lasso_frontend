import { MessageNotification } from '../../features/authentication/models/user.model';

export type MessagesInfo = {
  messageNotifications: MessageNotification[];
  count: number;
  hasMessages: boolean;
};
