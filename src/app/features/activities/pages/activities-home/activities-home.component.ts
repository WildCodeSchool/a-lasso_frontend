import { Component, OnInit, inject } from '@angular/core';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent],
  templateUrl: './activities-home.component.html',
  styleUrl: './activities-home.component.scss',
})
export class ActivitiesHomeComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities: Activity[] = []; // TODO: importer le typage d'activity

  ngOnInit(): void {
    this.activities = this.activityFacadeService.getActivities();
  }
}
