import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityStartResponse, ActivityUserRequest, AvalibleResgisters, PaymentMovement, StartActivityRequest, StartedResgister, ValidateActivityRequest, ValidateActivityResponse, ResumeActivity } from '../interfaces/actividades-interface';
import { genericResponse } from '../interfaces/responses';
import { endActivityRequest } from '../interfaces/checkout-interface';

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

  getResumeActivity(cajaActividadId: number): Observable<ResumeActivity> {
    return this.http.get<ResumeActivity>(this.url + "cajas-actividades/" + cajaActividadId, { headers: this.headers });
  }

  endActivity(cajaActividadId: number,data: endActivityRequest): Observable<genericResponse> {
    return this.http.put<genericResponse>(this.url + "cajas-actividades/" + cajaActividadId, data, { headers: this.headers });
  }

}
