import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { Activity } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivitySkeletonComponent } from '../../components/activity-skeleton/activity-skeleton.component';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent, AsyncPipe, ToggleMenuComponent, NgClass, ActivitySkeletonComponent],
  templateUrl: './activities-home.component.html',
  styleUrl: './activities-home.component.scss',
  standalone: true,
})
export class ActivitiesHomeComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities$: Observable<Activity[]> = this.activityFacadeService.activities$;

  navigationItems: string[] = ['Liste', 'Carte'];
  chosenNavigation: string = 'Liste';

  ngOnInit(): void {
    this.activityFacadeService.getAllActivitiesFromApi();
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }
}
