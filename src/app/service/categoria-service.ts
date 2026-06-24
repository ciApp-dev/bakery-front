import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Category } from '../interfaces/responses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

  getCategorias():  Observable<Category[]> {
    return this.http.get<Category[]>(this.url + "categorias", { headers: this.headers });
  }
}
