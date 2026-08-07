import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { PaymentCategory } from '../interfaces/payment-interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

  getPaymentCategories(estado: { estado: string }): Observable<PaymentCategory[]> {
    return this.http.get<PaymentCategory[]>(this.url + "metodos-pago", { headers: this.headers, params: estado });
  }


}
