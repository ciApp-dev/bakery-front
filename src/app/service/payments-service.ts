import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { PaymentCategory, PaymentCategoryRequest } from '../interfaces/payment-interface';
import { genericResponse } from '../interfaces/responses';

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


  savePaymentCategory(data: PaymentCategoryRequest): Observable<genericResponse> {
    return this.http.post<genericResponse>(this.url + "metodos-pago", data, { headers: this.headers });
  }


  editPaymentCategory(id: number, data: PaymentCategoryRequest): Observable<genericResponse> {
    return this.http.put<genericResponse>(this.url + "metodos-pago/" + id, data, { headers: this.headers });
  }

  deletePaymentCategory(id: number): Observable<genericResponse> {
    return this.http.delete<genericResponse>(this.url + "metodos-pago/" + id, { headers: this.headers });
  }

  reactivePaymentCategory(id: number): Observable<genericResponse> {
    return this.http.post<genericResponse>(this.url + "metodos-pago/" + id + "/reactivar", { headers: this.headers });
  }
}
