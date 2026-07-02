import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from '@environments/environment';
import { CiudadRequest } from '../interfaces/request';
import { Observable } from 'rxjs';
import { CiudadResponse } from '../interfaces/responses';
import { SelectorOption } from '../interfaces/forms';

@Injectable({
  providedIn: 'root',
})
export class CiudadesService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);

 getCiudadesByEstado(request: CiudadRequest):  Observable<SelectorOption[]> {
    return this.http.get<SelectorOption[]>(this.url + "ciudades/" + request.idEstado, { headers: this.headers });
  }

}
