import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesApiService {
  _http: HttpClient = inject(HttpClient);

  getAllActivities(): Observable<Activity[]> {
    // return this._http.get<Activity[]>("/activities");
    return this._http.get<Activity[]>('/activities/tempActivitiesData.json');
  }

  updateFavoriteStatus(activityId: string, isFavorite: boolean): Observable<boolean> {
    console.log('TO REMOVE ONCE BACK IS DONE', activityId, isFavorite);
    // this._http.put<Partial<Activity>>('/activities/updateFavorite', { activityId, isFavorite });
    return of(true);
  }
}
