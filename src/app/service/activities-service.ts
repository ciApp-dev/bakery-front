import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityStartResponse, ActivityUserRequest, AvalibleResgisters, StartActivityRequest, StartedResgister, ValidateActivityRequest, ValidateActivityResponse } from '../interfaces/actividades-interface';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {

  url = environment.apiUrl;
  headers = { 'Content-Type': 'application/json' };
  http = inject(HttpClient);


  getAvalibleResgisters(data: { sucursal_id: number }): Observable<AvalibleResgisters[]> {
    return this.http.get<AvalibleResgisters[]>(this.url + "cajas-disponibles", { headers: this.headers, params: data });
  }


  startActivity(data: StartActivityRequest): Observable<ActivityStartResponse> {
    return this.http.post<ActivityStartResponse>(this.url + "cajas-actividades", data, { headers: this.headers });
  }

  getStartedResgisters(data: { sucursal_id: number }): Observable<StartedResgister[]> {
    return this.http.get<StartedResgister[]>(this.url + "cajas-iniciadas", { headers: this.headers, params: data });
  }

  getValidateActivity(data: ValidateActivityRequest): Observable<ValidateActivityResponse> {
    return this.http.post<ValidateActivityResponse>(this.url + "cajas-actividad/autorizar", data, { headers: this.headers });
  }

  getActivityInfo(idActividad: number): Observable<ActivityStartResponse> {
    return this.http.get<ActivityStartResponse>(this.url + "cajas-actividades/" + idActividad, { headers: this.headers });
  }

  getActivityByUser(data: ActivityUserRequest): Observable<StartedResgister> {
    return this.http.post<StartedResgister>(this.url + "cajas-actividades/usuario", data, { headers: this.headers });
  }
}
