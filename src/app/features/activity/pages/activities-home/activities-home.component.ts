import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { Activity, Theme } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivitySkeletonComponent } from '../../components/activity-skeleton/activity-skeleton.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent, AsyncPipe, ActivitySkeletonComponent, ActivityFilterComponent, NgClass, ToggleMenuComponent],
  templateUrl: './activities-home.component.html',
  styleUrls: ['./activities-home.component.scss'],
  standalone: true,
})
export class ActivitiesHomeComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities$: Observable<Activity[]> = this.activityFacadeService.activities$;
  filteredActivities$: Observable<Activity[]> = this.activities$; // at init, there is no filter
  selectedThemes: Theme[] = [];

  navigationItems: string[] = ['Liste', 'Carte'];
  chosenNavigation: string = 'Liste';

  ngOnInit(): void {
    this.activityFacadeService.getActivityThemesFromApi();
    this.activityFacadeService.getAllActivitiesFromApi();
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }

  onSelectedThemeChanges(updatedSelectedThemes: Theme[]): void {
    this.selectedThemes = updatedSelectedThemes;

    this.filteredActivities$ = this.activities$.pipe(
      map(activities =>
        activities.filter(activity =>
          this.selectedThemes.length === 0 ? true : activity.theme.some(theme => this.selectedThemes.some(selected => selected.name === theme))
        )
      )
    );
  }
}
