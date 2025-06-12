import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AssociationRegister, UserLogin, VoluntaryRegister } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { ApiResponseLogin, JwtDecodedToken } from '../models/api-response.model';
import { EXPIRACY_MULTIPLIER, TokenRole, UserRole } from '../constants/auth.constants';
import { MessageService as Toast } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toast: Toast = inject(Toast);
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = environment.apiUrl;
  private _authState$ = new BehaviorSubject<boolean>(this._checkTokenValidOnInit());

  registerVoluntary(data: VoluntaryRegister): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/auth/register/voluntary`, data);
  }

  registerAssociation(data: AssociationRegister): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/auth/register/association`, data);
  }

  login(data: UserLogin): Observable<ApiResponseLogin> {
    return this._http.post<ApiResponseLogin>(`${this._apiUrl}/auth/login`, data);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this._http.patch<void>(`${this._apiUrl}/auth/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  deleteAccount(): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/auth/delete-account`);
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

  public updateAuthState(): boolean {
    const token = this.getToken();
    if (!token) {
      this._setAuthState(false);
      return this.getAuthState();
    }

    const decodedToken: JwtDecodedToken = jwtDecode(token);
    const expiryDate = new Date(decodedToken.exp * EXPIRACY_MULTIPLIER);

    if (expiryDate < new Date()) {
      this.clearToken();
      this._setAuthState(false);

      this.toast.add({
        summary: 'Session expirée',
        detail: 'Merci de vous reconnecter.',
        severity: 'warn',
      });

      return this.getAuthState();
    }

    this._setAuthState(true);
    return this.getAuthState();
  }

  private _setAuthState(bo: boolean): void {
    this._authState$.next(bo);
  }

  public getAuthState(): boolean {
    return this._authState$.value;
  }

  public getRolesUser(): Observable<UserRole[]> {
    return this._authState$.pipe(
      switchMap((bo: boolean) => {
        if (!bo) {
          return of([]);
        }
        const token = this.getToken();

        const decodedToken: JwtDecodedToken = jwtDecode(token);
        const roles = decodedToken.roles.map((role: TokenRole) => role.authority);
        return of(roles);
      })
    );
  }

  private _checkTokenValidOnInit(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decodedToken: JwtDecodedToken = jwtDecode(token);
      const expiryDate = new Date(decodedToken.exp * EXPIRACY_MULTIPLIER);
      return expiryDate > new Date();
    } catch {
      this.clearToken();
      return false;
    }
  }
}
