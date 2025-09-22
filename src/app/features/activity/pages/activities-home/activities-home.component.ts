import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FRANCE_LATITUDE, FRANCE_LONGITUDE } from 'src/app/features/map/constants/map.constants';
import { MapService } from 'src/app/features/map/services/map.service';
import { ToggleMenuComponent } from '../../../../common/components/toggle-menu/toggle-menu.component';
import { NavigationItems } from '../../../../common/models/toggle-menu';
import { MapComponent } from '../../../map/components/map/map.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
import { ActivityFilterSearchComponent } from '../../components/activity-filter-search/activity-filter-search.component';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { ActivitySkeletonComponent } from '../../components/activity-skeleton/activity-skeleton.component';
import { Activity, ActivitySearchFilters, ThemeName } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivityFilterService } from '../../services/activity-filter.service';
import { MyCityClickedEvent } from 'src/app/features/map/models/map';

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
  private _activityFilterService: ActivityFilterService = inject(ActivityFilterService);
  private _mapService: MapService = inject(MapService);

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  activities$: Observable<Activity[]> = this._activityFacadeService.activities$;
  filteredActivities$: Observable<Activity[]> = this.activities$;
  isMobile$: Observable<boolean> = fromEvent(window, 'resize').pipe(
    map(() => window.innerWidth < 901),
    startWith(window.innerWidth < 901)
  );

  searchFilters: ActivitySearchFilters = { search: '', date: '', location: '' };
  selectedThemesName: ThemeName[] = [];
  navigationItems: NavigationItems[] = [{ name: 'Liste' }, { name: 'Carte' }];
  chosenNavigation: string = 'Liste';
  searchedLat: number | null = null;
  searchedLon: number | null = null;

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

  async onSearchFiltersChanged(filters: ActivitySearchFilters): Promise<void> {
    this.searchFilters = filters;

    if (filters.location) {
      const coords = await this._mapService.geocodeCity(filters.location);
      if (coords) {
        this._activityFilterService.setSearchedLocation(coords.lat, coords.lon);
        this.mapComponent.flyTo(coords.lon, coords.lat, 10);
      } else {
        this._activityFilterService.setSearchedLocation(null, null);
      }
    } else {
      this._activityFilterService.setSearchedLocation(null, null);
      this.mapComponent.flyTo(FRANCE_LONGITUDE, FRANCE_LATITUDE, 5);
    }

    this._applyFilters();
  }

  onMyCityClicked(event: MyCityClickedEvent): void {
    this.searchFilters = {
      ...this.searchFilters,
      location: event.city,
    };

    this._activityFilterService.setSearchedLocation(event.coords.lat, event.coords.lon);
    this._applyFilters();
  }

  private _applyFilters(): void {
    this.filteredActivities$ = this.activities$.pipe(
      map(activities =>
        this._activityFilterService
          .filterActivities(activities, this.searchFilters, this.selectedThemesName)
          .filter(activity => new Date(activity.date).getTime() >= Date.now())
      )
    );
  }
}
