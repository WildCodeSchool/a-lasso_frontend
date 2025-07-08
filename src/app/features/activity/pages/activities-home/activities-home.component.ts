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
import { ActivityStatusEnum } from '../../models/activity-creation.model';

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
    this._applyFilters();
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
        activities.filter(
          activity =>
            this._matchesTheme(activity) &&
            this._matchesSearch(activity) &&
            this._matchesDate(activity) &&
            this._matchesLocation(activity) &&
            this._isNotADraft(activity)
        )
      )
    );
  }

  private _isNotADraft(activity: Activity): boolean {
    return activity.status !== ActivityStatusEnum.DRAFT;
  }

  private _matchesTheme(activity: Activity): boolean {
    if (this.selectedThemesName.length === 0) return true;
    return activity.themesName.some(theme => this.selectedThemesName.includes(theme));
  }

  private _matchesSearch(activity: Activity): boolean {
    if (!this.searchFilters.search) return true;

    const query = this.searchFilters.search.toLowerCase();
    return activity.title.toLowerCase().includes(query) || activity.description.toLowerCase().includes(query);
  }

  private _matchesDate(activity: Activity): boolean {
    if (!this.searchFilters.date) return true;

    const activityDate = new Date(activity.date).toDateString();
    const selectedDate = new Date(this.searchFilters.date).toDateString();
    return activityDate === selectedDate;
  }

  private _matchesLocation(activity: Activity): boolean {
    if (!this.searchFilters.location) return true;

    return activity.address.city.toLowerCase().includes(this.searchFilters.location.toLowerCase());
  }
}
