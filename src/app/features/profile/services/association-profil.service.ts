import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Statistic } from '../../association/models/association.model';
import { AssociationLogin } from '../../authentication/models/user.model';

@Injectable({ providedIn: 'root' })
export class AssociationProfileService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getAssociation(): Observable<AssociationLogin> {
    return this._http.get<AssociationLogin>(`${this._apiUrl}/association/me`);
  }

  updateGeneralInfo(generalInfo: { foundationDate: string; founder: string }): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/me/general-info`, generalInfo);
  }

  updateDescription(description: string): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/me/description`, { description });
  }

  updateStats(statistics: Statistic[]): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/association/me/statistics`, statistics);
  }

  uploadAssociationLogo(formData: FormData): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/association/me/logo`, formData);
  }
}
