import { Component, Input } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { RouterLink } from '@angular/router';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { environment } from 'src/environments/environment.development';
import { TruncatePipe } from '../../../../common/pipes/TruncateString.pipe';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, TruncatePipe, DatePipe, RouterLink, Card],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent {
  @Input() activity!: Activity;

  public apiUrl = environment.apiUrl;
}
