import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { Association } from '../models/association.model';
import { environment } from 'src/environments/environment';
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

  getExistingActivityPictures(currentOffset: number, pageSize: number): Observable<Image[]> {
    const params = {
      offset: currentOffset,
      limit: pageSize,
    };

    return this._http.get<Image[]>(`${this._apiUrl}/association/activities-images`, { params });
  }

  updateFollowStatus(associationId: UUIDTypes, isFollow: boolean): Observable<boolean> {
    return this._http.patch<boolean>(`${this._apiUrl}/association/${associationId}/updateFollow`, { isFollow });
  }

  patchAssociationField(associationId: UUIDTypes, payload: Partial<Association>): Observable<Association> {
    return this._http.patch<Association>(`${this._apiUrl}/association/${associationId}`, payload);
  }
}
