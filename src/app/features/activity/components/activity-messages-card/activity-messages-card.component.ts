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
import { FormField } from '../../../authentication/models/form.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { selectMessagesByActivityId } from '../../store/messages/messages.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-activity-messages-card',
  imports: [AsyncPipe, Card, InputFieldComponent, NgClass, Menu, ReactiveFormsModule],
  templateUrl: './activity-messages-card.component.html',
  styleUrl: './activity-messages-card.component.scss',
})
export class ActivityMessagesCardComponent implements OnInit {
  private _store: Store = inject(Store);
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  private _fb: FormBuilder = new FormBuilder();
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
  messageForm = this._fb.group({
    message: [''],
  });

  newMessageField: FormField = {
    name: 'message',
    label: 'Taper un message',
    type: 'text',
    required: true,
  };

  ngOnInit(): void {
    this._activityFacadeService.getActivityMessages(this.activityId);
    this.messages$ = this._store.select(selectMessagesByActivityId(this.activityId));
  }

  addEmoji(emoji: string): void {
    this.messageForm.controls.message.setValue(this.messageForm.value.message + emoji);
  }

  postMessage(): void {
    if (!this.messageForm.value.message) {
      return;
    }

    const newMessage: MessageCreation = {
      content: this.messageForm.value.message,
      activityId: this.activityId,
      date: new Date(),
    };

    this._activityFacadeService.postActivityMessage(newMessage);
    this.messageForm.reset();
  }
}
