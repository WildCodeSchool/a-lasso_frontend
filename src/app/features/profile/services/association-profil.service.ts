import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Statistic } from '../../association/models/association.model';
import { environment } from 'src/environments/environment';
import { UUIDTypes } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AssociationProfileService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  updateGeneralInfo(associationId: UUIDTypes, generalInfo: { foundationDate: string; founder: string }): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/${associationId}/general-info`, generalInfo);
  }

  updateDescription(associationId: UUIDTypes, description: string): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/${associationId}/description`, { description });
  }

  updateStats(associationId: UUIDTypes, statistics: Statistic[]): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/${associationId}/statistics`, statistics);
  }
}
