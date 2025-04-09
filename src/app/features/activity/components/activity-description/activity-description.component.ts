import { Component, inject, Input, OnInit } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.development';
import { InscriptionBadgeComponent } from '../inscription-badge/inscription-badge.component';
import { FavoriteHeartComponent } from '../favorite-heart/favorite-heart.component';
import { ButtonModule } from 'primeng/button';
import { UUIDTypes } from 'uuid';

@Component({
  selector: 'app-activity-description',
  imports: [InscriptionBadgeComponent, FavoriteHeartComponent, AsyncPipe, DatePipe, ButtonModule],
  templateUrl: './activity-description.component.html',
  styleUrl: './activity-description.component.scss',
})
export class ActivityDescriptionComponent implements OnInit {
  @Input() activityId!: UUIDTypes;

  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  activity$!: Observable<Activity | null>;

  public apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.activity$ = this.activityFacadeService.getActivityFromStore$(this.activityId);
  }

  toggleRegister(activityId: UUIDTypes, isRegistered: boolean): void {
    this.activityFacadeService.toggleRegister(activityId, isRegistered);
  }
}
