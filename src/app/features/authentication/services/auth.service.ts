import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AssociationRegister, UserLogin, VoluntaryRegister } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

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
    return this._http.post(`${this._apiUrl}/auth/login`, data, { responseType: 'text' });
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

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decodedToken: any = jwtDecode(token);
    const expiryDate = new Date(decodedToken.exp * 1000);
    if (expiryDate < new Date()) {
      this.clearToken();
      return false;
    }
    return true;
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.role : null;
  }
}
