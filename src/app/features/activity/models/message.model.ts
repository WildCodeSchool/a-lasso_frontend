import { UUIDTypes } from 'uuid';

export class Message {
  id: UUIDTypes = '';
  date: Date = new Date();
  content: string = '';
  isSendByUserConnected: boolean = false;
  activityId: UUIDTypes = '';

  constructor(message: Message) {
    this.id = message.id;
    this.date = message.date;
    this.content = message.content;
    this.isSendByUserConnected = message.isSendByUserConnected;
  }
}
