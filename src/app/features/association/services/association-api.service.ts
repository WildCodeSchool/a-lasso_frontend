import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { Association } from '../model/association.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AssociationApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getAssociationCard(id: UUIDTypes): Observable<Association> {
    return this._http.get<Association>(`${this._apiUrl}/association/${id}`);
  }

  updateFollowStatus(associationId: UUIDTypes, isFollow: boolean): Observable<boolean> {
    console.log('TO REMOVE ONCE BACK IS DONE', associationId, isFollow);
    // this._http.put<Partial<Activity>>('/activities/updateFavorite', { activityId, isFavorite });
    return of(true);
  }
}
