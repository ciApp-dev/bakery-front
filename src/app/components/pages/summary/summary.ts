import { Component, inject, signal } from '@angular/core';
import { ActivityStartResponse } from 'src/app/interfaces/actividades-interface';
import { ActivitiesService } from 'src/app/service/activities-service';
import { ActivityStartComponent } from "../../elements/activity-start/activity-start";
import { ToastService } from 'src/app/service/toast-service';

type ActivityStartPayload = {
  activity: string;
  reference: string;
};


@Component({
  selector: 'app-summary',
  imports: [ActivityStartComponent],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class SummaryComponent {


  activityService = inject(ActivitiesService);
  toastService = inject(ToastService);


  isActivityStartOpen = signal(false);
   readonly activityOptions = [
    { value: 'inventario', label: 'Inventario' },
    { value: 'venta', label: 'Venta' },
    { value: 'produccion', label: 'Produccion' },
  ];


  constructor() {
    this.validateActivityStart();

  }


   onActivityCancel(): void {
    this.isActivityStartOpen.set(false);
  }

  onActivityStart(payload: ActivityStartPayload): void {
    
    this.isActivityStartOpen.set(false);
  }

  validateActivityStart(): void {

    const activityId = localStorage.getItem('idActividad');


    if(activityId === null || activityId === undefined || activityId === '') {
      this.isActivityStartOpen.set(true);
      return;
    }else {

    

    this.activityService.getActivityInfo(Number(activityId)).subscribe({
      next: (response: ActivityStartResponse) => {
        if (response.estado === 'ACT') {
          
        } else {
          localStorage.removeItem('idActividad');
          localStorage.removeItem('nombreCaja');
          localStorage.removeItem('idCaja');
          this.isActivityStartOpen.set(true);
          this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
        }   
      },
      error: (response: any) => {
        console.error('Error al validar la actividad:', response);
        localStorage.removeItem('idActividad');
        localStorage.removeItem('nombreCaja');
        localStorage.removeItem('idCaja');
        this.isActivityStartOpen.set(true);
        this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
      }
    }); 
  }
}

}
