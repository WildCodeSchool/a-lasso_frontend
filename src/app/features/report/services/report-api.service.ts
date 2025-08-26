import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Report } from '../models/report.model';
import { UUIDTypes } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ReportApiService {
  private _http: HttpClient = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getReportsFromApi(): Observable<Report[]> {
    return this._http.get<Report[]>(`${this._apiUrl}/report`);
  }

  getReportsByReportedIdFromApi(reportedId: UUIDTypes): Observable<Report[]> {
    return this._http.get<Report[]>(`${this._apiUrl}/report/${reportedId}`);
  }

  sendReport(report: Report): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/report`, report);
  }

  updateReport(report: Report): Observable<boolean> {
    return this._http.put<boolean>(`${this._apiUrl}/report`, report);
  }

  banUser(userId: UUIDTypes, userType: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._apiUrl}/report/ban/${userId}/${userType}`);
  }
}
