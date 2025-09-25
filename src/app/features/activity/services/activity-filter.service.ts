import { Injectable } from '@angular/core';
import { Activity, ActivitySearchFilters, ThemeName } from '../models/activity.model';
import { getDistanceBetweenCoordinatesInKm } from '../utils/location.utils';
import { ActivityStatusEnum } from '../models/activity-creation.model';

@Injectable({ providedIn: 'root' })
export class ActivityFilterService {
  private _searchedLat: number | null = null;
  private _searchedLon: number | null = null;

  setSearchedLocation(lat: number | null, lon: number | null): void {
    this._searchedLat = lat;
    this._searchedLon = lon;
  }

  filterActivities(activities: Activity[], filters: ActivitySearchFilters, selectedThemesName: ThemeName[]): Activity[] {
    return activities.filter(
      activity =>
        this._isNotADraft(activity) &&
        this._matchesTheme(activity, selectedThemesName) &&
        this._matchesSearch(activity, filters.search) &&
        this._matchesDate(activity, filters.date) &&
        this._matchesLocation(activity, filters.location)
    );
  }

  private _isNotADraft(activity: Activity): boolean {
    return activity.status !== ActivityStatusEnum.DRAFT;
  }

  private _matchesTheme(activity: Activity, selectedThemesName: ThemeName[]): boolean {
    if (selectedThemesName.length === 0) return true;
    return activity.themesName.some(theme => selectedThemesName.includes(theme));
  }

  private _matchesSearch(activity: Activity, search: string): boolean {
    if (!search) return true;
    const query = search.toLowerCase();
    return activity.title.toLowerCase().includes(query) || activity.description.toLowerCase().includes(query);
  }

  private _matchesDate(activity: Activity, date: string): boolean {
    if (!date) return true;
    const activityDate = new Date(activity.date).toDateString();
    const selectedDate = new Date(date).toDateString();
    return activityDate === selectedDate;
  }

  private _matchesLocation(activity: Activity, location: string): boolean {
    if (this._searchedLat !== null && this._searchedLon !== null) {
      const actLat = activity.location.latitude;
      const actLon = activity.location.longitude;

      if (actLat && actLon) {
        const distance = getDistanceBetweenCoordinatesInKm(this._searchedLat, this._searchedLon, actLat, actLon);
        return distance <= 100;
      }
    }

    if (location) {
      return activity.address.city.toLowerCase().includes(location.toLowerCase());
    }

    return true;
  }
}
