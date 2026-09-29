import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PaymentMovement } from '../interfaces/actividades-interface';
import { Observable } from 'rxjs';
import { genericResponse } from '../interfaces/responses';
import { resumeMovements } from '../interfaces/checkout-interface';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  
  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

  
    sendMovement(data: PaymentMovement): Observable<genericResponse> {
    return this.http.post<any>(this.url + "caja-movimientos", data, { headers: this.headers });
  }

  getMovements(id: number): Observable<resumeMovements> {
    return this.http.get<resumeMovements>(this.url + "caja-movimientos/" + id, { headers: this.headers });
  }
}
