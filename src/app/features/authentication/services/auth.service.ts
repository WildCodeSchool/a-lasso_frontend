import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AssociationRegister, UserLogin, VoluntaryRegister } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { ApiResponseLogin, JwtDecodedToken } from '../models/api-response.model';
import { EXPIRACY_MULTIPLIER, TokenRole, UserRole } from '../constants/auth.constants';

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

  login(data: UserLogin): Observable<ApiResponseLogin> {
    return this._http.post<ApiResponseLogin>(`${this._apiUrl}/auth/login`, data);
  }

  public saveToken(token: string): void {
    localStorage.setItem('tokenAlAsso', token);
  }

  public getToken(): string {
    if (localStorage.getItem('tokenAlAsso')) {
      return localStorage.getItem('tokenAlAsso') as string;
    }

    return '';
  }

  public clearToken(): void {
    localStorage.removeItem('tokenAlAsso');
  }

  public clearUserState(): void {
    localStorage.removeItem('userState');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decodedToken: JwtDecodedToken = jwtDecode(token);
    const expiryDate = new Date(decodedToken.exp * EXPIRACY_MULTIPLIER);
    if (expiryDate < new Date()) {
      this.clearToken();
      return false;
    }
    return true;
  }

  public getRolesUser(): Observable<UserRole[]> {
    const token = this.getToken();
    if (!token) return of([]);

    const decodedToken: JwtDecodedToken = jwtDecode(token);
    const roles = decodedToken.roles.map((role: TokenRole) => role.authority);
    return of(roles);
  }
}
