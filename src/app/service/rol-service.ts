import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { RoleCategory, RolePermissionResponse, RoleRequest } from '../interfaces/roles-interface';
import { genericResponse } from '../interfaces/responses';



@Injectable({
  providedIn: 'root',
})
export class RolService {


  url = environment.apiUrl;
  headers = {
    'Content-Type': 'application/json'
  };
  http = inject(HttpClient);

getRoles(estado: { estado: string }): Observable<RoleCategory[]> {
  return this.http.get<RoleCategory[]>(this.url + "roles", { headers: this.headers,params:estado });
}

saveRole(data: RoleRequest): Observable<RoleCategory> {
  return this.http.post<RoleCategory>(this.url + "roles", data, { headers: this.headers });
}

updateRole(id: number, data: RoleRequest): Observable<RoleCategory> {
  return this.http.put<RoleCategory>(this.url + "roles/" + id, data, { headers: this.headers });
}

deleteRole(id: number): Observable<genericResponse> {
  return this.http.post<genericResponse>(this.url + "roles/desactivar/" + id, { headers: this.headers });
}

reactivateRole(id: number): Observable<genericResponse> {
  return this.http.post<genericResponse>(this.url + "roles/activar/" + id, {}, { headers: this.headers });
}

getPermissionsByRole(roleId: number): Observable<RolePermissionResponse> {
  return this.http.get<RolePermissionResponse>(this.url + "roles/permissions/" + roleId, { headers: this.headers });
}
}
