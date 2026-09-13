import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PosService {

  url = environment.apiUrl;
  headers = {
    'Content-Type': 'application/json'
  };
  http = inject(HttpClient);


  printTicket(data: any) {
    return this.http.get(`${this.url}ventas/ticket`, { responseType: 'blob'});
  }

}
