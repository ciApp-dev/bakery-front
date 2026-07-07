import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ApiResponse, LoginResponse, LoginUserRequest, userResponse } from '../interfaces/responses';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

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

 

}
