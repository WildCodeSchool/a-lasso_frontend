import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AssociationRegister, UserLogin, VoluntaryRegister } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  registerVoluntary(data: VoluntaryRegister): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/auth/register/voluntary`, data);
  }

  registerAssociation(data: AssociationRegister): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/auth/register/association`, data);
  }

  login(data: UserLogin): Observable<string> {
    return this._http.post<string>(`${this._apiUrl}/auth/login`, data);
  }
}
