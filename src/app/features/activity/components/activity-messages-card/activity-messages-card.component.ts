import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { Observable } from 'rxjs';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Card } from 'primeng/card';
import { InputFieldComponent } from '../../../../common/components/input-field/input-field.component';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MessageCreation } from '../../models/messageCreation';

@Component({
  selector: 'app-activity-messages-card',
  imports: [AsyncPipe, Card, InputFieldComponent, NgClass, Menu],
  templateUrl: './activity-messages-card.component.html',
  styleUrl: './activity-messages-card.component.scss',
})
export class ActivityMessagesCardComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  @Input() activityId!: string;

  messages$!: Observable<Message[]>;
  emojis: MenuItem[] = [
    { label: '😂', command: () => this.addEmoji('😂') },
    { label: '😍', command: () => this.addEmoji('😍') },
    { label: '😭', command: () => this.addEmoji('😭') },
    { label: '😎', command: () => this.addEmoji('😎') },
    { label: '🥳', command: () => this.addEmoji('🥳') },
    { label: '😡', command: () => this.addEmoji('😡') },
    { label: '🤩', command: () => this.addEmoji('🤩') },
    { label: '🤔', command: () => this.addEmoji('🤔') },
  ];
  newMessageContent: string = '';

  ngOnInit(): void {
    this.messages$ = this.activityFacadeService.getActivityMessages(this.activityId);
  }

  addEmoji(emoji: string): void {
    this.newMessageContent += emoji;
  }

  postMessage(): void {
    if (!this.newMessageContent) {
      return;
    }

    const newMessage: MessageCreation = {
      content: this.newMessageContent,
      activityId: this.activityId,
      date: new Date(),
    };

    this.activityFacadeService.postActivityMessage(newMessage);
  }
}
