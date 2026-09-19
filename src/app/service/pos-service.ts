import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { SaleResponse, Sell } from '../interfaces/pos-interface';
import { Observable } from 'rxjs';
import { genericResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class PosService {

  url = environment.apiUrl;
  headers = {
    'Content-Type': 'application/json'
  };
  http = inject(HttpClient);


  printTicket(id: number) {
    return this.http.get(`${this.url}ventas/ticket/${id}`, { responseType: 'blob'});
  }

  sendSale(data: Sell): Observable<SaleResponse>{
    return this.http.post<SaleResponse>(`${this.url}ventas`, data, { headers: this.headers });
  }


}
