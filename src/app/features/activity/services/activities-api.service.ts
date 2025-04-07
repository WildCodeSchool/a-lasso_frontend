import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';
import { environment } from 'src/environments/environment.development';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { MessageCreation } from '../models/messageCreation';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { Theme } from '../models/theme.model';

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

  updateFavoriteStatus(activityId: UUIDTypes, isFavorite: boolean): Observable<boolean> {
    return this._http.patch<boolean>(`${this._apiUrl}/activities/${activityId}/updateFavorite`, { isFavorite });
  }

  updateRegisterStatus(activityId: UUIDTypes, isRegistered: boolean): Observable<APIResponseToggleRegister> {
    return this._http.patch<APIResponseToggleRegister>(`${this._apiUrl}/activities/${activityId}/updateRegistered`, { isRegistered });
  }

  // Modifier le return de RegisterStatus :

  getActivityMessages(activityId: UUIDTypes): Observable<Message[]> {
    return this._http.get<Message[]>(`${this._apiUrl}/messages/${activityId}`);
  }

  postActivityMessage(message: MessageCreation): Observable<Message> {
    return this._http.post<Message>(`${this._apiUrl}/messages`, message);
  }
}
