import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Category } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { categoryRegister } from '../interfaces/categories-interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

  getCategorias(estado: { estado: string }):  Observable<Category[]> {
    return this.http.get<Category[]>(this.url + "categorias", { headers: this.headers, params: estado });
  }

  saveCategoria(data: categoryRegister): Observable<Category> {
    return this.http.post<Category>(this.url + "categorias", data, { headers: this.headers });
  }

  updateCategoria(id: number, data: categoryRegister): Observable<Category> {
    return this.http.put<Category>(this.url + `categorias/${id}`, data, { headers: this.headers });
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(this.url + `categorias/${id}`, { headers: this.headers });
  }

  reactivateCategoria(id: number): Observable<Category> {
    return this.http.post<Category>(this.url + `categorias/${id}/reactivar`, {}, { headers: this.headers });
  }
}
