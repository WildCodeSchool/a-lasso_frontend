import { Component, inject, OnInit } from '@angular/core';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Activity } from '../../models/activity.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent, AsyncPipe],
  templateUrl: './activities-home.component.html',
  styleUrl: './activities-home.component.scss',
})
export class ActivitiesHomeComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities$: Observable<Activity[]> = this.activityFacadeService.activities$;

  ngOnInit(): void {
    this.activityFacadeService.getAllActivities();
  }
}
