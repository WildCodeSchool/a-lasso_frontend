import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { Activity } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent, AsyncPipe, ToggleMenuComponent, NgClass],
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
    this.activityFacadeService.getAllActivities();
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }
}
