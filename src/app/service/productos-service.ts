import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProductResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { ProductSendData, ProductTableRow } from '../interfaces/products-interfaces';
import { statusRequest } from '../interfaces/request';

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

  editProduct(producto: ProductSendData, id: number): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.url}productos/${id}`, producto, { headers: this.headers });
  }

  deleteProduct(id: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.url}productos/${id}`, { headers: this.headers });
  }

  getProducts(estado: statusRequest): Observable<ProductTableRow[]> {
    return this.http.get<ProductTableRow[]>(`${this.url}productos`, { headers: this.headers, params: { estado: estado.estado } });
  }

  reactivateProduct(id: number): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.url}productos/${id}/reactivar`, {}, { headers: this.headers });
  }


  

}