import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { MapComponent } from '../../../map/components/map/map.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { ActivitySkeletonComponent } from '../../components/activity-skeleton/activity-skeleton.component';
import { Activity, ActivitySearchFilters, ThemeName } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivityFilterSearchComponent } from '../../components/activity-filter-search/activity-filter-search.component';
import { NavigationItems } from '../../../../common/models/toggle-menu';

@Component({
  selector: 'app-activities-home',
  imports: [
    ActivityCardComponent,
    AsyncPipe,
    ActivitySkeletonComponent,
    ActivityFilterComponent,
    NgClass,
    ToggleMenuComponent,
    MapComponent,
    ActivityFilterSearchComponent,
  ],
  templateUrl: './activities-home.component.html',
  styleUrls: ['./activities-home.component.scss'],
  standalone: true,
})
export class ActivitiesHomeComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  activities$: Observable<Activity[]> = this._activityFacadeService.activities$;
  filteredActivities$: Observable<Activity[]> = this.activities$;

  searchFilters: ActivitySearchFilters = { search: '', date: '', location: '' };
  selectedThemesName: ThemeName[] = [];
  navigationItems: NavigationItems[] = [{ name: 'Liste' }, { name: 'Carte' }];
  chosenNavigation: string = 'Liste';

  ngOnInit(): void {
    this._activityFacadeService.getActivityThemesFromApi();
    this._activityFacadeService.getAllActivitiesFromApi();
  }

  handleNavigation(title: string): void {
    this.chosenNavigation = title;
  }

  onSelectedThemeChanges(updatedSelectedThemesName: ThemeName[]): void {
    this.selectedThemesName = updatedSelectedThemesName;
    this._applyFilters();
  }

  onSearchFiltersChanged(filters: ActivitySearchFilters): void {
    this.searchFilters = filters;
    this._applyFilters();
  }

  private _applyFilters(): void {
    this.filteredActivities$ = this.activities$.pipe(
      map(activities =>
        activities.filter(activity => {
          const selectedThemesCount = 0;
          const matchesTheme =
            this.selectedThemesName.length === selectedThemesCount || activity.themesName.some(theme => this.selectedThemesName.includes(theme));

          const matchesSearch =
            !this.searchFilters.search ||
            activity.title.toLowerCase().includes(this.searchFilters.search.toLowerCase()) ||
            activity.description.toLowerCase().includes(this.searchFilters.search.toLowerCase());

          const matchesDate = !this.searchFilters.date || new Date(activity.date).toDateString() === new Date(this.searchFilters.date).toDateString();

          const matchesLocation =
            !this.searchFilters.location || activity.location.city.toLowerCase().includes(this.searchFilters.location.toLowerCase());

          return matchesTheme && matchesSearch && matchesDate && matchesLocation;
        })
      )
    );
  }
}
