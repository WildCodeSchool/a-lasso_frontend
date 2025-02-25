import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { environment } from 'src/environments/environment.development';
import { TruncatePipe } from '../../../../common/Pipes/TruncateString.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, TruncatePipe, DatePipe],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent {
  @Input() activity!: Activity;

  public apiUrl = environment.apiUrl;
}
