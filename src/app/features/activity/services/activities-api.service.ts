import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Activity } from '../models/activity.model';
import { environment } from 'src/environments/environment.development';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getAllActivities(): Observable<Activity[]> {
    return this._http.get<Activity[]>(`${this._apiUrl}/activities`);
  }

  updateFavoriteStatus(activityId: string, isFavorite: boolean): Observable<boolean> {
    console.log('TO REMOVE ONCE BACK IS DONE', activityId, isFavorite);
    // this._http.put<Partial<Activity>>('/activities/updateFavorite', { activityId, isFavorite });
    return of(true);
  }

  getActivityMessages(activityId: UUIDTypes): Observable<Message[]> {
    return this._http.get<Message[]>(`${this._apiUrl}/messages/${activityId}`);
  }
}
