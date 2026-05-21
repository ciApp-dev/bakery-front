import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/resposnes';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  url = environment.apiUrl;
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  http = inject(HttpClient);

  saveUser(user: any[]):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.url + "usuarios", user, { headers: this.headers });
  }


}
