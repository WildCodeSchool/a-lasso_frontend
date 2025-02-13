import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
}
