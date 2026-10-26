import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesReportRequest, SalesReportResponse } from '../interfaces/reports-interfaces';

@Injectable({
  providedIn: 'root',
})
export class SalesService {

  url = environment.apiUrl;
  headers = {
    'Content-Type': 'application/json'
  };
  http = inject(HttpClient);


  getSales(filters: SalesReportRequest): Observable<SalesReportResponse> {
    let params = new HttpParams();

    // 0 and '' mean "Todas"; the API treats any non-blank value as a filter.
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        params = params.set(key, String(value));
      }
    }

    return this.http.get<SalesReportResponse>(`${this.url}ventas`, { headers: this.headers, params });
  }

  getExcel(filters: SalesReportRequest): Observable<Blob> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        params = params.set(key, String(value));
      }
    }

    return this.http.get(`${this.url}ventas/exportar`, { headers: this.headers, params, responseType: 'blob' });
  }
}
