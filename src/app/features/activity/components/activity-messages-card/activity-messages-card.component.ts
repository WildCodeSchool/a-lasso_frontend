import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { Observable } from 'rxjs';
import { ActivityFacadeService } from '../../services/activity-facade.service';

@Component({
  selector: 'app-activity-messages-card',
  imports: [],
  templateUrl: './activity-messages-card.component.html',
  styleUrl: './activity-messages-card.component.scss',
})
export class ActivityMessagesCardComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  @Input() activityId!: string;

  messages$!: Observable<Message[]>;

  ngOnInit(): void {
    this.activityFacadeService.getMessagesActivity(this.activityId);
  }
}
