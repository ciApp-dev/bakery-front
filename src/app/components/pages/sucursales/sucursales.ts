import { Component, inject, signal } from '@angular/core';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { ToggleSwitch } from "../../elements/toggle-switch/toggle-switch";
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { ContentLabelTable, RowActionEvent, SelectorOption } from 'src/app/interfaces/forms';
import { EstadosService } from 'src/app/service/estados-service';
import { CiudadesService } from 'src/app/service/ciudades-service';
import { ToastService } from 'src/app/service/toast-service';
import { TableForm } from "../../elements/tables/table-form/table-form";
import { SucursalesService } from 'src/app/service/sucursales-service';
import { SucursalSendData, SucursalTableRow } from 'src/app/interfaces/sucursales-interfaces';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { statusRequest } from 'src/app/interfaces/request';

@Component({
  selector: 'app-sucursales',
  imports: [InputSearchForm, ButtonMainForm, LabelForm, InputForm, ButtonSecundaryForm, ReactiveFormsModule, ToggleSwitch, SelectorForm, TableForm],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css',
})
export class SucursalesComponent {
  private readonly phonePattern = /^\d{3} \d{3} \d{4}$/;


  sucursalesService = inject(SucursalesService);
  estadosService = inject(EstadosService);
  ciudadesService = inject(CiudadesService);
  toastService = inject(ToastService);
  confirmDialogService = inject(ConfirmDialogService);

  allSucursales = signal<SucursalTableRow[]>([]);
  tableContent = signal<SucursalTableRow[]>([]);

  modeForm = signal<string>('create');
  idEstado = signal<number | null>(null);
  idCiudad = signal<number | null>(null);
  searchTerm = signal<string>('');

  idSelected = signal<number | null>(null);
  nombre = signal<string>('');
  direccion = signal<string>('');
  cp = signal<number | null>(null);
  ciudad = signal<string>('');
  estado = signal<string>('');
  status = signal<string>('');
  telefono = signal<string>('');
  produccion = signal<string>('NO');



  opcionesEstados = signal<SelectorOption[]>([]);
  opcionesCiudades = signal<SelectorOption[]>([]);

  //FORM
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phonePattern)]),
    address: new FormControl('', [Validators.required]),
    postalCode: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d{5}$/)]),
    idEstado: new FormControl<number | null>(null, [Validators.required]),
    idCiudad: new FormControl<number | null>(null, [Validators.required]),
  });

  showCreateSection = signal<boolean>(false);
  branchActive = signal<boolean>(false);
  showDeleted = signal<boolean>(false);

  sucursalName: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'nombre' },
    { id: 2, name: 'Dirección', key: 'direccion' },
    { id: 3, name: 'Código Postal', key: 'cp' },
    { id: 4, name: 'Ciudad', key: 'ciudad' },
    { id: 5, name: 'Estado', key: 'estado' },
    { id: 6, name: 'Teléfonos', key: 'telefonos' },
    { id: 7, name: 'Producción', key: 'produccion' },
    { id: 8, name: 'Acciones', key: 'actions' }
  ];


  constructor() {
    this.getEstados();
    this.getSucursales();
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.applySearchFilter();
  }
  onNameChange(value: string | number): void {
    const parsedValue = String(value);
    this.nombre.set(parsedValue);
    this.form.get('name')?.setValue(parsedValue);
    this.form.get('name')?.markAsTouched();
  }

  onPhoneChange(value: string | number): void {
    const parsedValue = String(value);
    this.telefono.set(parsedValue);
    this.form.get('phone')?.setValue(parsedValue);
    this.form.get('phone')?.markAsTouched();
  }

  onAddressChange(value: string | number): void {
    const parsedValue = String(value);
    this.direccion.set(parsedValue);
    this.form.get('address')?.setValue(parsedValue);
    this.form.get('address')?.markAsTouched();
  }

  onPostalCodeChange(value: string | number): void {
    const parsedValue = Number(value);
    this.cp.set(parsedValue);
    this.form.get('postalCode')?.setValue(parsedValue);
    this.form.get('postalCode')?.markAsTouched();
  }

  onBranchActiveChange(value: boolean): void {
    if (value) {
      this.produccion.set('SI');
    } else {
      this.produccion.set('NO');
    }

    console.log('Producción:', this.produccion());
  }

  onShowDeletedChange(value: boolean): void {
    this.showDeleted.set(value);
    this.getSucursales();
  }

  onEstadoChange(value: number): void {
    const parsedValue = value > 0 ? value : null;
    this.idEstado.set(parsedValue);
    this.form.controls.idEstado.setValue(parsedValue);
    this.form.controls.idEstado.markAsTouched();
    this.getCiudadesByEstado(value);

    console.log('Estado seleccionado:', parsedValue);
    if (parsedValue === null || parsedValue) {

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
      postalCode: null,
      idEstado: null,
      idCiudad: null,
    });
    this.produccion.set('NO');
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



  getSucursales(): void {

    const estado: statusRequest = { estado: this.showDeleted() ? 'INA' : 'ACT' };

    this.sucursalesService.getSucursales(estado).subscribe({
      next: (response) => {
        // Aquí puedes manejar la respuesta y actualizar tu estado o variables locales
        this.allSucursales.set(response);
        this.applySearchFilter(); // Aplicar el filtro de búsqueda después de obtener las sucursales
      },
      error: (error) => {
        console.error('Error al obtener las sucursales:', error);
        this.toastService.showErrorToast('Error al obtener las sucursales', 'No se pudieron cargar las sucursales. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }


  async saveSucursalData(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const sucursalData: SucursalSendData = {
      nombre: this.nombre(),
      direccion: this.direccion(),
      cp: this.cp() || 0,
      ciudad_id: this.idCiudad(),
      estado_id: this.idEstado(),
      telefonos: this.telefono(),
      produccion: this.produccion(),
    };

    if (this.modeForm() == 'edit') {

      const confirmed = await this.confirmDialogService.confirm({
        title: 'Actualizar Sucursal',
        message: '¿Estás seguro de que deseas actualizar esta sucursal?',
        confirmLabel: 'Actualizar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.sucursalesService.editSucursal(sucursalData, this.idSelected()!).subscribe({
        next: (response) => {

          this.toastService.showSuccessToast('Sucursal actualizada exitosamente');
          this.cancelSave();
          this.getSucursales();
        },
        error: (error) => {
          console.error('Error al actualizar la sucursal:', error);
          this.toastService.showErrorToast('Error al actualizar la sucursal', 'No se pudo actualizar la sucursal. Por favor, inténtalo de nuevo más tarde.');
        }
      });



    } else {

      const confirmed = await this.confirmDialogService.confirm({
        title: this.modeForm() === 'guardar' ? 'Guardar Sucursal' : 'Registrar Sucursal',
        message: this.modeForm() === 'guardar' ? '¿Estás seguro de que deseas guardar esta sucursal?' : '¿Estás seguro de que deseas registrar esta sucursal?',
        confirmLabel: this.modeForm() === 'guardar' ? 'Guardar' : 'Registrar',
        cancelLabel: 'Cancelar',
        destructive: this.modeForm() === 'guardar',
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.sucursalesService.saveSucursal(sucursalData).subscribe({
        next: (response) => {
          console.log('Sucursal guardada:', response);
          this.toastService.showSuccessToast('Sucursal guardada exitosamente');
          this.cancelSave();
          this.getSucursales();
        },
        error: (error) => {
          console.error('Error al guardar la sucursal:', error);
          this.toastService.showErrorToast('Error al guardar la sucursal', 'No se pudo guardar la sucursal. Por favor, inténtalo de nuevo más tarde.');
        }
      });
    }
  }

  editSucursal(event: RowActionEvent<SucursalTableRow>): void {
    this.modeForm.set('edit');

    this.onNameChange(event.row.nombre);
    this.onPhoneChange(event.row.telefonos[0] || '');
    this.onAddressChange(event.row.direccion);
    this.onPostalCodeChange(event.row.cp);

    if (event.row.produccion === 'SI') {
      this.branchActive.set(true);
      this.produccion.set('SI');
    } else {
      this.branchActive.set(false);
      this.produccion.set('NO');
    }

    const estadoOption = this.opcionesEstados().find(option => option.nombre === event.row.estado);
    if (estadoOption) {
      this.onEstadoChange(estadoOption.id);
    }

    this.getCiudadesByEstado(estadoOption ? estadoOption.id : 0);

    const ciudadOption = this.opcionesCiudades().find(option => option.nombre === event.row.ciudad);
    if (ciudadOption) {
      this.onCiudadChange(ciudadOption.id);
    }

    this.showCreateSection.set(true);

    this.form.patchValue({
      name: event.row.nombre,
      phone: event.row.telefonos[0] || '',
      address: event.row.direccion,
      postalCode: event.row.cp,
      idEstado: estadoOption ? estadoOption.id : null,
      idCiudad: ciudadOption ? ciudadOption.id : null,
    });

    this.form.markAsTouched();

    this.idSelected.set(event.row.id);


  }



  async deleteSucursal(event: RowActionEvent<SucursalTableRow>): Promise<void> {

    if (this.showDeleted()) {
      const confirmed = await this.confirmDialogService.confirm({
        title: 'Reactivar Sucursal',
        message: '¿Estás seguro de que deseas reactivar esta sucursal?',
        confirmLabel: 'Reactivar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.sucursalesService.reactivateSucursal(event.row.id).subscribe({
        next: (response) => {
          console.log('Sucursal reactivada:', response);
          this.toastService.showSuccessToast('Sucursal reactivada exitosamente');
          this.getSucursales();
        },
        error: (error) => {
          console.error('Error al reactivar la sucursal:', error);
          this.toastService.showErrorToast('Error al reactivar la sucursal', 'No se pudo reactivar la sucursal. Por favor, inténtalo de nuevo más tarde.');
        }
      });

    } else {

      const confirmed = await this.confirmDialogService.confirm({
        title: 'Eliminar Sucursal',
        message: '¿Estás seguro de que deseas eliminar esta sucursal?',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.sucursalesService.deleteSucursal(event.row.id).subscribe({
        next: (response) => {
          console.log('Sucursal eliminada:', response);
          this.toastService.showSuccessToast('Sucursal eliminada exitosamente');
          this.getSucursales();
        },
        error: (error) => {
          console.error('Error al eliminar la sucursal:', error);
          this.toastService.showErrorToast('Error al eliminar la sucursal', 'No se pudo eliminar la sucursal. Por favor, inténtalo de nuevo más tarde.');
        }
      });
    }


    


   
} 



applySearchFilter(): void {
    const term = this.searchTerm().trim().toLowerCase();

    if(!term) {
      this.tableContent.set(this.allSucursales());
      return;
    }

    const filtered = this.allSucursales().filter(sucursal => {
      return (
        sucursal.nombre.toLowerCase().includes(term) ||
        sucursal.direccion.toLowerCase().includes(term) ||
        sucursal.ciudad.toLowerCase().includes(term) ||
        sucursal.estado.toLowerCase().includes(term) ||
        sucursal.cp.toString().includes(term) ||
        sucursal.telefonos.some(telefono => telefono.includes(term)) ||
        sucursal.produccion.toLowerCase().includes(term)
      );
    });

    this.tableContent.set(filtered); 

  }
}
