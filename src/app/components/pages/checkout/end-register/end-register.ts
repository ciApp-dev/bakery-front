import { Component, effect, inject, input, signal } from '@angular/core';
import { ToastService } from 'src/app/service/toast-service';
import { ActivitiesService } from 'src/app/service/activities-service';
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { ButtonMainForm } from "src/app/components/elements/buttons/button-main-form/button-main-form";
import { ModalDenoCash } from '../modal-deno-cash/modal-deno-cash';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { endActivityRequest } from 'src/app/interfaces/checkout-interface';
import { Router } from '@angular/router';
import { endActivityResponse } from 'src/app/interfaces/actividades-interface';

@Component({
  selector: 'app-end-register',
  imports: [InputForm, ButtonMainForm, ModalDenoCash],
  templateUrl: './end-register.html',
  styleUrl: './end-register.css',
})
export class EndRegister {

  confirmDialogService = inject(ConfirmDialogService);
  activitiesService = inject(ActivitiesService);
  toastService = inject(ToastService);

  cashAmount = input.required<number>();// Cash amount counted by the system
  totalCash = signal<number>(0); //Cash amount physically counted
  difference = signal<number>(0);

  router = inject(Router);


  observations = signal<string>(''); 
  showModal = signal<boolean>(false); 


  constructor() {
    effect(() => {
      this.difference.set(this.totalCash() - this.cashAmount());
    });
  }
  onCashInputClick(value: Event) {
    this.showModal.set(true);
  }

  onObservationsChange(value: number | string): void {
    this.observations.set(String(value));
  }
  async endActivity() {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Confirmar cierre de caja',
      message: '¿Desea cerrar la actividad de caja?',
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true,
    });

    if(!confirmed) {
      return;
    }

    const data: endActivityRequest = {
      usuario_cierre_id: Number(localStorage.getItem('id_user')),
      monto_estimado: this.cashAmount(),
      monto_cierre: this.totalCash(),
      observaciones: this.observations(),
    };
    
    this.activitiesService.endActivity(Number(localStorage.getItem('actividad_id')), data).subscribe({
      next: (response: endActivityResponse) => {
        localStorage.removeItem('actividad_id');
        localStorage.removeItem('caja_id');
        localStorage.removeItem('nombre_caja');
        this.toastService.showSuccessToast('Actividad de caja cerrada exitosamente');
        this.showTicket(Number(response.data.id));
        this.router.navigate(['dashboard/summary']);

      },
      error: (error) => {
        this.toastService.showErrorToast('Error al cerrar la actividad de caja',error);
      }
    });
  }
  
  calculateDifference(value: string | number): void {
    const valueParsed = Number(value) || 0;
    this.totalCash.set(valueParsed);
  }

  clearData(): void {
    this.totalCash.set(0);
    this.difference.set(0);
    this.observations.set('');
    this.showModal.set(false);
  }

  showTicket(cajaActividadId: number): void {
    const ticketTab = window.open('about:blank', '_blank');
    if (!ticketTab) {
      this.toastService.showErrorToast(
        'No se pudo abrir el ticket',
        'Permite las ventanas emergentes en el navegador e inténtalo de nuevo.'
      );
      return;
    }

    this.activitiesService.endActivityTicket(cajaActividadId).subscribe({
      next: (blob) => {
        const pdf = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdf);
        ticketTab.location.href = url;
        window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
      },
      error: (error) => {
        ticketTab.close();
        this.toastService.showErrorToast('Error al generar el ticket', error);
      }
    });
  }
}
