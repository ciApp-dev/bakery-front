import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { SelectorOption } from '../interfaces/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

  getEstados():  Observable<SelectorOption[]> {
    return this.http.get<SelectorOption[]>(this.url + "estados", { headers: this.headers });
  }

}
