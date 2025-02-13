import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
}
