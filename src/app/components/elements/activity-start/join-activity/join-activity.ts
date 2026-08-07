import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectorOption } from 'src/app/interfaces/forms';
import { ActivitiesService } from 'src/app/service/activities-service';
import { SelectorForm } from "../../selectors/selector-form/selector-form";
import { ButtonMainForm } from "../../buttons/button-main-form/button-main-form";
import { InputForm } from "../../inputs/input-form/input-form";
import { ValidateActivityRequest, ValidateActivityResponse } from 'src/app/interfaces/actividades-interface';
import { ToastService } from 'src/app/service/toast-service';



@Component({
  selector: 'app-join-activity',
  imports: [SelectorForm, ButtonMainForm, InputForm],
  templateUrl: './join-activity.html',
  styleUrl: './join-activity.css',
})
export class JoinActivity {

  activityService = inject(ActivitiesService);
  toastService = inject(ToastService);

  optionRegister = signal<SelectorOption[]>([]);


  registerSelected = signal<number | null>(null);
  passwordValue = signal<string | number>('');
  readonly completed = output<void>();

  

  form = new FormGroup({
    register: new FormControl<number | null>(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.getAvalibreRegisters();
    
  }

  onRegisterSelected(event: number): void {
    this.registerSelected.set(event);
    this.form.controls.register.setValue(event);
    this.form.controls.register.markAsTouched();
    console.log('Registro seleccionado:', event);
  }

  onPasswordChange(event: string | number): void {
    this.passwordValue.set(event);
    this.form.controls.password.setValue(event as string);
    this.form.controls.password.markAsTouched();
  }

  getAvalibreRegisters(): void {
   
  const sucursalId = Number(localStorage.getItem('idSucursal'));
  if (!isNaN(sucursalId)) {
    this.activityService.getStartedResgisters({ sucursal_id: sucursalId }).subscribe({
      next: (response) => {
        const options = response.map((register) => ({
          id: register.caja_id,
          nombre: register.nombre,
        }));
        this.optionRegister.set(options);

        
      },
      error: (error) => {
        console.error('Error al obtener los registros disponibles:', error);
      }     

    });
  }
}

joinActivity(): void {
  if (!this.form.valid) {
    this.form.markAllAsTouched();
    return;
  }

  const data: ValidateActivityRequest = {
    caja_id: Number(this.registerSelected()),
    password: String(this.passwordValue()),
  };

  console.log('Datos enviados para validación:', data);

  this.activityService.getValidateActivity(data).subscribe({
    next: (response: ValidateActivityResponse) => {
      localStorage.setItem('idCaja', String(response.caja_id));
      localStorage.setItem('idActividad', String(response.id));
      localStorage.setItem('nombreCaja', response.nombre);
      this.toastService.showSuccessToast('Validacion exitosa');
      this.completed.emit();
    },
    error: (error) => {
      console.error('Error en la validación:', error);
      this.toastService.showErrorToast('Error en la validación', 'Ocurrió un error al intentar validar la actividad. Por favor, inténtalo de nuevo.');
    }
  });
}

}
