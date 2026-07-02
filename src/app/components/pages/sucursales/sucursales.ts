import { Component,inject,signal } from '@angular/core';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { ToggleSwitch } from "../../elements/toggle-switch/toggle-switch";
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { EstadosService } from 'src/app/service/estados-service';
import { CiudadesService } from 'src/app/service/ciudades-service';
import { ToastService } from 'src/app/service/toast-service';

@Component({
  selector: 'app-sucursales',
  imports: [InputSearchForm, ButtonMainForm, LabelForm, InputForm, ButtonSecundaryForm, ReactiveFormsModule, ToggleSwitch, SelectorForm],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css',
})
export class SucursalesComponent {
  private readonly phonePattern = /^\d{3} \d{3} \d{4}$/;


  estadosService = inject(EstadosService);
  ciudadesService = inject(CiudadesService);
  toastService = inject(ToastService);

  branchActive = signal(false);
  modeForm = signal<string>('create');
  idEstado = signal<number | null>(null);
  idCiudad = signal<number | null>(null);

  opcionesEstados = signal<SelectorOption[]>([]);
  opcionesCiudades = signal<SelectorOption[]>([]);

  //FORM
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phonePattern)]),
    address: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
    idEstado: new FormControl<number | null>(null, [Validators.required]),
    idCiudad: new FormControl<number | null>(null, [Validators.required]),
  });

  showCreateSection = signal<boolean>(false);


  constructor() {
    this.getEstados();
  }

  onNameChange(value: string | number): void {
    const parsedValue = String(value); 
    this.form.get('name')?.setValue(parsedValue);
    this.form.get('name')?.markAsTouched();
  }

  onPhoneChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('phone')?.setValue(parsedValue);
    this.form.get('phone')?.markAsTouched();
  }

  onAddressChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('address')?.setValue(parsedValue);
    this.form.get('address')?.markAsTouched();
  }

  onPostalCodeChange(value: string | number): void {
    const parsedValue = String(value);
    this.form.get('postalCode')?.setValue(parsedValue);
    this.form.get('postalCode')?.markAsTouched();
  }

  onBranchActiveChange(value: boolean): void {
    this.branchActive.set(value);
  }

  onEstadoChange(value: number): void {
    const parsedValue = value > 0 ? value : null;
    this.idEstado.set(parsedValue);
    this.form.controls.idEstado.setValue(parsedValue);
    this.form.controls.idEstado.markAsTouched();
    this.getCiudadesByEstado(value);

    if(parsedValue === null || parsedValue) {

    }
    
  }

  onCiudadChange(value: number): void {
    const parsedValue = value > 0 ? value : null;
    this.idCiudad.set(parsedValue);
    this.form.controls.idCiudad.setValue(parsedValue);
    this.form.controls.idCiudad.markAsTouched();
  }

  saveSucursal(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  cancelSave(): void {
    this.form.reset({
      name: '',
      phone: '',
      address: '',
      postalCode: '',
      idEstado: null,
      idCiudad: null,
    });
    this.branchActive.set(true);
    this.form.markAsUntouched();
    this.showCreateSection.set(false);
  }


  getEstados(): void {
    this.estadosService.getEstados().subscribe({
      next: (response: SelectorOption[]) => {
        this.opcionesEstados.set(response);
      },
      error: (error) => {
        console.error('Error al obtener los estados:', error);
        this.toastService.showErrorToast('Error al obtener los estados', 'No se pudieron cargar los estados. Por favor, inténtalo de nuevo más tarde.');
      }
    });

  }

  getCiudadesByEstado(idEstado: number): void {
    const request = { idEstado: idEstado };

    this.ciudadesService.getCiudadesByEstado(request).subscribe({
      next: (response) => {
        this.opcionesCiudades.set(response);
      },
      error: (error) => {
        console.error('Error al obtener las ciudades:', error);
        this.toastService.showErrorToast('Error al obtener las ciudades', 'No se pudieron cargar las ciudades. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }

}
