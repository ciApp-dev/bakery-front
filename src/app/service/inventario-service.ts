import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { abastoSucursalRequest, statusRequest } from '../interfaces/request';
import { genericResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { pendingTransfer, pendingTransferResponse, productoInterface, transferenciaInterface } from '../interfaces/invetario-interface';


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

    transferProduct(data: transferenciaInterface): Observable<genericResponse> {
      return this.http.post<genericResponse>(`${this.url}transferir`, data, { headers: this.headers });
    }

    outRegister(data: abastoSucursalRequest): Observable<genericResponse> {
      return this.http.post<genericResponse>(`${this.url}retirar`, data, { headers: this.headers });
    }

    getPendingTransfers(data: pendingTransfer): Observable<pendingTransferResponse[]> {
      return this.http.get<pendingTransferResponse[]>(`${this.url}movimientos/sucursal/${data.sucursal_id}`, { headers: this.headers, params: { fecha_inicio: data.fecha_inicio, fecha_fin: data.fecha_fin } });
    } 

  }
