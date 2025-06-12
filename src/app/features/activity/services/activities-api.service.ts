import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, Theme } from '../models/activity.model';
import { environment } from 'src/environments/environment.development';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { MessageCreation } from '../models/messageCreation';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { NewActivityCreation } from '../models/activity-creation.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getActivityThemes(): Observable<Theme[]> {
    return this._http.get<Theme[]>(`${this._apiUrl}/themes`);
  }

  getAllActivities(): Observable<Activity[]> {
    return this._http.get<Activity[]>(`${this._apiUrl}/activities`);
  }

  getActivityById(activityId: UUIDTypes): Observable<Activity> {
    return this._http.get<Activity>(`${this._apiUrl}/activities/${activityId}`);
  }

  updateFavoriteStatus(activityId: UUIDTypes, isSaved: boolean): Observable<boolean> {
    return this._http.patch<boolean>(`${this._apiUrl}/activities/${activityId}/updateFavorite`, { isSaved });
  }

  updateRegisterStatus(activityId: UUIDTypes, isRegistered: boolean): Observable<APIResponseToggleRegister> {
    return this._http.patch<APIResponseToggleRegister>(`${this._apiUrl}/activities/${activityId}/updateRegistered`, { isRegistered });
  }

  getActivityMessages(activityId: UUIDTypes): Observable<Message[]> {
    return this._http.get<Message[]>(`${this._apiUrl}/messages/${activityId}`);
  }

  postActivityMessage(message: MessageCreation): Observable<Message> {
    return this._http.post<Message>(`${this._apiUrl}/messages`, message);
  }

  getAdressFromApi(query: string): Observable<any> {
    const lang = navigator.language || 'fr';

    return this._http.get<any[]>(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '10',
        'accept-language': lang,
      },
    });
  }

  publishNewActivity(newActivity: NewActivityCreation): Observable<Activity> {
    return this._http.post<Activity>(`${this._apiUrl}/activities/publish`, newActivity);
  }

  deleteActivity(activityId: UUIDTypes): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/activities/delete/${activityId}`);
  }
}
