import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { Association } from '../models/association.model';
import { environment } from 'src/environments/environment.development';
import { Image } from '../../activity/models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class AssociationApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getAssociationCard(id: UUIDTypes): Observable<Association> {
    return this._http.get<Association>(`${this._apiUrl}/association/${id}`);
  }

  getExistingActivityPictures(): Observable<Image[]> {
    return this._http.get<Image[]>(`${this._apiUrl}/association/activities-images`);
  }

  updateFollowStatus(associationId: UUIDTypes, isFollow: boolean): Observable<boolean> {
    return this._http.patch<boolean>(`${this._apiUrl}/association/${associationId}/updateFollow`, { isFollow });
  }
}
