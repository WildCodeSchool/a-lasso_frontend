import { Component, inject, Input, OnInit } from '@angular/core';
import { Activity, Participant } from '../../models/activity.model';
import { RouterLink } from '@angular/router';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { environment } from 'src/environments/environment.development';
import { TruncatePipe } from '../../../../common/pipes/TruncateString.pipe';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Observable } from 'rxjs';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { getImageSource } from 'src/app/common/utils/image.utils';

@Component({
  selector: 'app-activity-card',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, TruncatePipe, DatePipe, RouterLink, Card, AsyncPipe],
  templateUrl: './activity-card.component.html',
  styleUrl: './activity-card.component.scss',
  standalone: true,
})
export class ActivityCardComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  @Input() activity!: Activity;

  public isSavedActivity$: Observable<boolean>;
  public voluntariesRegistered$: Observable<Participant>;

  public apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.isSavedActivity$ = this._activityFacadeService.getIsSavedActivity(this.activity.id);
    this.voluntariesRegistered$ = this._activityFacadeService.getVoluntariesRegisteredToAnActivity(this.activity.id);
  }

  getImageSrc(): string {
    return getImageSource(this.activity);
  }
}
