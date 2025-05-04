import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportApiService {
  _http: HttpClient = inject(HttpClient);

  private _apiUrl = environment.apiUrl;

  getReportsFromApi(): Observable<Report[]> {
    return this._http.get<Report[]>(`${this._apiUrl}/report`);
  }

  sendReport(report: Report): Observable<boolean> {
    return this._http.post<boolean>(`${this._apiUrl}/report`, report);
  }
}
