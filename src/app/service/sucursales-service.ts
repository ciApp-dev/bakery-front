import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { SucursalSendData, SucursalTableRow } from '../interfaces/sucursales-interfaces';
import { Observable } from 'rxjs';
import { SucursalResponse } from '../interfaces/responses';
import { statusRequest } from '../interfaces/request';

@Injectable({
  providedIn: 'root',
})
export class SucursalesService {

  URL = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);


  getSucursales(estado: statusRequest):Observable<SucursalTableRow[]> {
    const params = { estado: estado.estado };
    return this.http.get<SucursalTableRow[]>(`${this.URL}sucursales`, { headers: this.headers, params });
  }

  saveSucursal(sucursal: SucursalSendData): Observable<SucursalResponse> {
    return this.http.post<SucursalResponse>(`${this.URL}sucursales`, sucursal, { headers: this.headers });
  }

  editSucursal(sucursal: SucursalSendData, id: number): Observable<SucursalResponse> {
    return this.http.put<SucursalResponse>(`${this.URL}sucursales/${id}`, sucursal, { headers: this.headers });
  }

  deleteSucursal(id: number): Observable<SucursalResponse> {
    return this.http.delete<SucursalResponse>(`${this.URL}sucursales/${id}`, { headers: this.headers });
  }
  
  reactivateSucursal(id: number): Observable<SucursalResponse> {
    return this.http.post<SucursalResponse>(`${this.URL}sucursales/${id}/reactivar`, {}, { headers: this.headers });
  }
}
