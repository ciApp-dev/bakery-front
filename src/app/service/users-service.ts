import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserData, UserDataRequest, UserUpdateRequest } from '../interfaces/users-interface';
import { Observable } from 'rxjs';
import { genericResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  URL = environment.apiUrl;
  headers = {
    'Content-Type': 'application/json',
  };
  http = inject(HttpClient);


  getUsers(estado: string):Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.URL}users`, { headers: this.headers, params: { estado } });
  }

  updateBranchUser(id: number, userData: UserUpdateRequest): Observable<UserData> {
    return this.http.put<UserData>(`${this.URL}users/${id}`, userData, { headers: this.headers });
  }

  updateUser(id: number, userData: UserDataRequest): Observable<UserData> {
    return this.http.put<UserData>(`${this.URL}users/${id}`, userData, { headers: this.headers });
  }

  createUser(userData: UserDataRequest): Observable<genericResponse> {
    return this.http.post<genericResponse>(`${this.URL}usuarios`, userData, { headers: this.headers });
  }

  deleteUser(id: number): Observable<genericResponse> {
    return this.http.delete<genericResponse>(`${this.URL}users/${id}`, { headers: this.headers });
  }

  activateUser(id: number): Observable<genericResponse> {
    return this.http.post<genericResponse>(`${this.URL}users/${id}/reactivar`, {}, { headers: this.headers });
  }
}
