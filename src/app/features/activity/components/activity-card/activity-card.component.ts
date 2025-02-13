import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity-card',
  imports: [],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
}
