import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { Activity, ThemeNameEnum } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivitySkeletonComponent } from '../../components/activity-skeleton/activity-skeleton.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { map } from 'rxjs/operators';
import { MapComponent } from '../../../map/components/map/map.component';

@Component({
  selector: 'app-activities-home',
  imports: [ActivityCardComponent, AsyncPipe, ActivitySkeletonComponent, ActivityFilterComponent, NgClass, ToggleMenuComponent, MapComponent],
  templateUrl: './activities-home.component.html',
  styleUrls: ['./activities-home.component.scss'],
  standalone: true,
})
export class ActivitiesHomeComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities$: Observable<Activity[]> = this.activityFacadeService.activities$;
  filteredActivities$: Observable<Activity[]> = this.activities$;
  selectedThemesName: ThemeNameEnum[] = [];

  navigationItems: string[] = ['Liste', 'Carte'];
  chosenNavigation: string = 'Liste';

  ngOnInit(): void {
    this.activityFacadeService.getActivityThemesFromApi();
    this.activityFacadeService.getAllActivitiesFromApi();
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }

  onSelectedThemeChanges(updatedSelectedThemesName: ThemeNameEnum[]): void {
    this.selectedThemesName = updatedSelectedThemesName;

    this.filteredActivities$ = this.activities$.pipe(
      map(activities =>
        activities.filter(activity =>
          this.selectedThemesName.length === 0
            ? true
            : activity.themesName.some(themeName => this.selectedThemesName.some(selectedName => selectedName === themeName))
        )
      )
    );
  }
}
