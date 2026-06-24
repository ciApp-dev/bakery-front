import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProductResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { ProductSendData } from '../interfaces/forms';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);


  saveProduct(producto: ProductSendData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.url}productos`, producto, { headers: this.headers });
  }
}