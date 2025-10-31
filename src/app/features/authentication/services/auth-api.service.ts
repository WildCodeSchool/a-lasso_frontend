import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserState } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getUserByToken(): Observable<UserState> {
    return this._http.get<UserState>(`${this._apiUrl}/auth/token`);
  }
}
