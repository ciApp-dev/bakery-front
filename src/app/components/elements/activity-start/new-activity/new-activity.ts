import { Component, inject, output, signal } from '@angular/core';
import { ToastService } from 'src/app/service/toast-service';
import { InputForm } from "../../inputs/input-form/input-form";
import { ButtonMainForm } from "../../buttons/button-main-form/button-main-form";
import { ButtonSecundaryForm } from "../../buttons/button-secundary-form/button-secundary-form";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { SelectorForm } from "../../selectors/selector-form/selector-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { ActivitiesService } from 'src/app/service/activities-service';
import { StartActivityRequest } from 'src/app/interfaces/actividades-interface';

@Component({
  selector: 'app-new-activity',
  imports: [InputForm, ButtonMainForm, ButtonSecundaryForm, SelectorForm],
  templateUrl: './new-activity.html',
  styleUrl: './new-activity.css',
})
export class NewActivity {

  confirmDialogService = inject(ConfirmDialogService);
  activitiesService = inject(ActivitiesService);
  toastService = inject(ToastService);

  registerSelected = signal<number | null>(null);
  amount = signal<number>(0);
  observations = signal<string>('');

  optionsActivity = signal<SelectorOption[]>([]);
  readonly completed = output<void>();

  form = new FormGroup({
    register: new FormControl<number | null>(null, [Validators.required]),
    amount: new FormControl(this.amount(), [Validators.required, Validators.min(1)]),
    observations: new FormControl('', [Validators.maxLength(255)]),
  });




  constructor(){
  this.getAvalibreRegisters();
  }


  cancelNewActivity(): void {
    this.amount.set(0);
    this.form.reset();
    this.observations.set('');
    this.registerSelected.set(null);
  }


  onRegisterChange(value: number): void {
    this.registerSelected.set(value);
    this.form.controls.register.setValue(value);
    this.form.controls.register.markAsTouched();
  }
  
  onAmountChange(value: string | number): void {
    const numericValue = typeof value === 'number' ? value : Number(String(value).replace(',','.'));

    this.amount.set(numericValue);
    this.form.controls.amount.setValue(Number.isFinite(numericValue) ? numericValue : 0);
    this.form.controls.amount.markAsTouched();
    
  }

  onObservationsChange(value: string | number): void {
    const stringValue = typeof value === 'string' ? value : String(value);
    this.observations.set(stringValue);
    this.form.controls.observations.setValue(stringValue);
    this.form.controls.observations.markAsTouched();
  }


  async startNewActivity(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
   

    const data: StartActivityRequest = {
      caja_id: Number(this.registerSelected()),
      usuario_apertura_id: Number(localStorage.getItem('id_user')),
      monto_apertura: this.amount(),
      observaciones: this.observations() || undefined,
    };


    const confirmed = await this.confirmDialogService.confirm({
      title: 'Confirmar inicio de actividad',
      message: '¿Estás seguro de que deseas iniciar la actividad?',
      confirmLabel: 'Sí, iniciar',
      cancelLabel: 'Cancelar',
    });

    if (!confirmed) {
      return;
    } 
    this.activitiesService.startActivity(data).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Actividad iniciada correctamente');
        localStorage.setItem('idCaja', String(response.caja_id));
        localStorage.setItem('idActividad', String(response.id));
        localStorage.setItem('nombreCaja', response.nombre_caja);
        this.cancelNewActivity();
        this.getAvalibreRegisters();
        this.completed.emit();
      },
      error: (error) => {
        console.error('Error al iniciar la actividad:', error);
        this.toastService.showErrorToast('Error al iniciar la actividad', 'Ocurrió un error al intentar iniciar la actividad. Por favor, inténtalo de nuevo.');
      }
    });
    
  }

  getAvalibreRegisters(): void {
    const sucursalId = Number(localStorage.getItem('idSucursal'));
    if(!Number.isFinite(sucursalId) || sucursalId <= 0){
      this.toastService.showErrorToast('Error al obtener los registros disponibles', 'El ID de la sucursal no es válido.');
      return;
    }

    this.activitiesService.getAvalibleResgisters({ sucursal_id: sucursalId }).subscribe({
      next: (response) => {
        const options = response.map((register) => ({
          id: register.id,
          nombre: register.nombre,
        }));
        this.optionsActivity.set(options);
      },
      error: (error) => {
        console.error('Error al obtener los registros disponibles:', error);
      },
    }); 
  }
}
