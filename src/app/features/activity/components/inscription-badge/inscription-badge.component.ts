import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-inscription-badge',
  standalone: true,
  imports: [],
  templateUrl: './inscription-badge.component.html',
  styleUrl: './inscription-badge.component.scss',
})
export class InscriptionBadgeComponent {
  @Input() activity!: Activity;
}
