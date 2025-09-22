import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Activity, Theme } from '../models/activity.model';
import { environment } from 'src/environments/environment';
import { UUIDTypes } from 'uuid';
import { Message } from '../models/message.model';
import { MessageCreation } from '../models/messageCreation';
import { APIResponseToggleRegister } from '../models/api-reponse.model';
import { ActivityFormData } from '../models/activity-creation.model';
import { AddressApiResult } from '../../authentication/models/user.model';
import { HOUSE_NUMBER_REGEX } from '../../authentication/constants/form.constants';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getActivityThemes(): Observable<Theme[]> {
    return this._http.get<Theme[]>(`${this._apiUrl}/themes`);
  }

  getFutureActivities(): Observable<Activity[]> {
    return this._http.get<Activity[]>(`${this._apiUrl}/activities/future`);
  }

  getPastActivities(): Observable<Activity[]> {
    return this._http.get<Activity[]>(`${this._apiUrl}/activities/past`);
  }

  getActivitiesByAssociationId(associationId: UUIDTypes): Observable<Activity[]> {
    return this._http.get<Activity[]>(`${this._apiUrl}/activities/association/${associationId}`);
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

  getAddressFromApi(query: string): Observable<AddressApiResult[]> {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=10`;
    return this._http
      .get<any>(url)
      .pipe(map(response => response.features.map((feature: AddressApiResult) => this._mapFeatureToAddressApiResult(feature))));
  }

  saveActivity(activity: ActivityFormData): Observable<Activity> {
    return this._http.post<Activity>(`${this._apiUrl}/activities`, activity);
  }

  deleteActivity(activityId: UUIDTypes): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/activities/delete/${activityId}`);
  }

  private _mapFeatureToAddressApiResult(feature: any): AddressApiResult {
    const { label, name, postcode, city, context } = feature.properties;
    const [lat, lon] = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

    const { houseNumber, road } = this._parseHouseNumberAndRoad(name);

    return {
      displayName: label,
      latitude: String(lat),
      longitude: String(lon),
      address: {
        houseNumber: houseNumber,
        road: road,
        postCode: postcode,
        city: city,
        state: context,
        country: 'France',
        countryCode: 'fr',
      },
    };
  }

  private _parseHouseNumberAndRoad(name: string): { houseNumber?: string; road?: string } {
    const match = name.match(HOUSE_NUMBER_REGEX);
    if (match) {
      return {
        houseNumber: match[1],
        road: match[2],
      };
    }
    return {
      road: name,
    };
  }
}
