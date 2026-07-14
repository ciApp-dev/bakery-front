import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { abastoSucursalRequest, statusRequest } from '../interfaces/request';
import { genericResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { productoInterface } from '../interfaces/invetario-interface';


@Injectable({
  providedIn: 'root',
})
export class InventarioService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);



  abastoSucursal(data: abastoSucursalRequest): Observable<genericResponse> {
    return this.http.post<genericResponse>(`${this.url}abastecer`, data, { headers: this.headers });
  }

   getProducts(estado: statusRequest): Observable<productoInterface[]> {
      return this.http.get<productoInterface[]>(`${this.url}productos`, { headers: this.headers, params: { estado: estado.estado } });
    }

  }
