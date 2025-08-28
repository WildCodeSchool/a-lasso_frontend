import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VoluntaryLogin } from '../../authentication/models/user.model';
import { VoluntaryUpdateRequestDTO } from '../models/update-request-dto.models';
import { Image } from '../../activity/models/activity.model';

@Injectable({ providedIn: 'root' })
export class VoluntaryProfileService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getVoluntary(): Observable<VoluntaryLogin> {
    return this._http.get<VoluntaryLogin>(`${this._apiUrl}/voluntary/me`);
  }

  updateVoluntaryProfile(payload: VoluntaryUpdateRequestDTO): Observable<void> {
    return this._http.put<void>(`${this._apiUrl}/voluntary/me`, payload);
  }

  uploadVoluntaryAvatar(formData: FormData): Observable<Image> {
    return this._http.post<Image>(`${this._apiUrl}/voluntary/me/avatar`, formData);
  }
}
