import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Customer, CustomerRequest } from '../interfaces/customers-interface';
import { Observable } from 'rxjs';
import { statusRequest } from '../interfaces/request';
import { genericResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);




  getCustomers(estado: statusRequest): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}clientes`, { headers: this.headers, params: { estado: estado.estado } });
  }

  saveCustomer(data: CustomerRequest): Observable<genericResponse> {
    return this.http.post<genericResponse>(`${this.url}clientes`, data, { headers: this.headers });
  }

  updateCustomer(id: number | null, data: CustomerRequest): Observable<genericResponse> {
    return this.http.put<genericResponse>(`${this.url}clientes/${id}`, data, { headers: this.headers });
  }

  deleteCustomer(id: number | null): Observable<genericResponse> {
    return this.http.delete<genericResponse>(`${this.url}clientes/${id}`, { headers: this.headers });
  }

  restoreCustomer(id: number | null): Observable<genericResponse> {
    return this.http.post<genericResponse>(`${this.url}clientes/${id}/reactivar`, {}, { headers: this.headers });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}clientes/${id}`, { headers: this.headers });
  }
}
