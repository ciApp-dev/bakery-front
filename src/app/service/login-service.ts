import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { LoginResponse, LoginUserRequest, RefreshTokenResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);


  loginUser(user: LoginUserRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url + "login", user, { headers: this.headers });
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const accessToken = localStorage.getItem('access_token');
    const refreshHeaders = accessToken
      ? { ...this.headers, Authorization: `Bearer ${accessToken}` }
      : this.headers;

    return this.http.post<RefreshTokenResponse>(
      this.url + 'refresh',
      {},
      { headers: refreshHeaders }
    );
  }

 

}
