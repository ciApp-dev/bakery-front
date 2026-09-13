import { Component, inject, signal } from '@angular/core';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentLabelTable, RowActionEvent, SelectorOption } from 'src/app/interfaces/forms';
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";
import { LabelForm } from "../../elements/labels/label-form/label-form";
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { ToggleSwitch } from "../../elements/toggle-switch/toggle-switch";
import { TableForm } from "../../elements/tables/table-form/table-form";
import { EstadosService } from 'src/app/service/estados-service';
import { CiudadesService } from 'src/app/service/ciudades-service';
import { CustomersService } from 'src/app/service/customers-service';
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { Customer, CustomerRequest } from 'src/app/interfaces/customers-interface';

@Component({
  selector: 'app-customers',
  imports: [InputSearchForm, ButtonMainForm, LabelForm, InputForm, ButtonSecundaryForm, ToggleSwitch, TableForm, ReactiveFormsModule, SelectorForm],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class CustomersComponent {

  toastService = inject(ToastService);
  confirmDialogService = inject(ConfirmDialogService);
  estadosService = inject(EstadosService);
  ciudadesService = inject(CiudadesService);
  customersService = inject(CustomersService);


  allCustomers = signal<any[]>([]);
  tableContent = signal<any[]>([]);

  modeForm = signal<'create' | 'update'>('create');
  idEstado = signal<number | null>(null);
  idCiudad = signal<number | null>(null);
  searchTerm = signal<string>('');

  idSelectedCustomer = signal<number | null>(null);
  name = signal<string>('');
  lastname = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  rfc = signal<string>('');
  address = signal<string>('');
  cp = signal<number | null>(null);
  estado = signal<string>('');
  ciudad = signal<string>('');

  opcionesEstados = signal<SelectorOption[]>([]);
  opcionesCiudades = signal<SelectorOption[]>([]);

  showDeleted = signal(false);

  lblBtn2 = signal<string>('Eliminar');
  iconBtn2 = signal<string>('delete');
  colorBtn2 = signal<string>('text-red-500');

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    rfc: new FormControl('', [Validators.required, Validators.maxLength(13), Validators.pattern(/^[A-Za-z0-9]+$/)]),
    address: new FormControl('', [Validators.required]),
    cp: new FormControl<number | null>(null, [Validators.required, Validators.pattern(/^\d{5}$/)]),
    idEstado: new FormControl<number | null>(null, [Validators.required]),
    idCiudad: new FormControl<number | null>(null, [Validators.required]),
  });


  showCreateSection = signal(false);


  customerLabel: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'nombre' },
    { id: 2, name: 'Apellido', key: 'apellido' },
    { id: 3, name: 'Correo', key: 'email' },
    { id: 4, name: 'Teléfono', key: 'telefono' },
    { id: 5, name: 'RFC', key: 'rfc' },
    { id: 6, name: 'Dirección', key: 'direccion' },
    { id: 7, name: 'Código Postal', key: 'cp' },
    { id: 8, name: 'Estado', key: 'estado' },
    { id: 9, name: 'Ciudad', key: 'ciudad' },
    { id: 10, name: 'Acciones', key: 'actions' }
  ];


  constructor() {
    this.getCustomers();
    this.getEstados();
   }


  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.applySearchFilter();
  }

  onNameChange(value: string | number): void {
    const pasedValue = String(value)
    this.name.set(pasedValue);
    this.form.get('name')?.setValue(pasedValue);
    this.form.get('name')?.markAsTouched();
  }

  onLastnameChange(value: string | number): void {
    const pasedValue = String(value)
    this.lastname.set(pasedValue);
    this.form.get('lastname')?.setValue(pasedValue);
    this.form.get('lastname')?.markAsTouched();
  }

  onEmailChange(value: string | number): void {
    const pasedValue = String(value)
    this.email.set(pasedValue);
    this.form.get('email')?.setValue(pasedValue);
    this.form.get('email')?.markAsTouched();
  }

  onPhoneChange(value: string | number): void {
    const pasedValue = String(value)
    this.phone.set(pasedValue);
    this.form.get('phone')?.setValue(pasedValue);
    this.form.get('phone')?.markAsTouched();
  }

  onRfcChange(value: string | number): void {
    const pasedValue = String(value)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
    this.rfc.set(pasedValue);
    this.form.get('rfc')?.setValue(pasedValue);
    this.form.get('rfc')?.markAsTouched();
  }

  onAddressChange(value: string | number): void {
    const pasedValue = String(value)
    this.address.set(pasedValue);
    this.form.get('address')?.setValue(pasedValue);
    this.form.get('address')?.markAsTouched();
  }

  onCpChange(value: string | number): void {
    const pasedValue = Number(value)
    this.cp.set(pasedValue);
    this.form.get('cp')?.setValue(pasedValue);
    this.form.get('cp')?.markAsTouched();
  }

  onEstadoChange(value: number): void {
    const pasedValue = value > 0 ? value : null; 
    this.idEstado.set(pasedValue);
    this.form.controls.idEstado.setValue(pasedValue);
    this.form.controls.idEstado.markAsTouched();
    this.getCiudadesByEstado(value);
  }

  onCiudadChange(value: number): void {
    const pasedValue = value > 0 ? value : null;
    this.idCiudad.set(pasedValue);
    this.form.controls.idCiudad.setValue(pasedValue);
    this.form.controls.idCiudad.markAsTouched();
  }

  onShowDeletedChange(value: boolean): void {

    this.lblBtn2.set(value ? 'Reactivar' : 'Eliminar');
    this.iconBtn2.set(value ? 'refresh' : 'delete');
    this.colorBtn2.set(value ? 'text-green-500' : 'text-red-500');
    this.showDeleted.set(value);
    this.getCustomers();
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


  cancelSave(): void {
    this.showCreateSection.set(false);
    this.form.reset();
    this.modeForm.set('create');
    this.idSelectedCustomer.set(null);

  }

  async saveCustomer(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newCustomer: CustomerRequest = {
        nombre: String(this.name()),
        apellido: String(this.lastname()),
        email: String(this.email()),
        telefono: String(this.phone()),
        rfc: String(this.rfc()),
        direccion: String(this.address()),
        cp: Number(this.cp() ?? null),
        estado_id: this.idEstado() ? String(this.idEstado()) : '',
        ciudad_id: this.idCiudad() ? String(this.idCiudad()) : '',
      };

    if(this.modeForm() === 'create') {

      const confirmed = await this.confirmDialogService.confirm({
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas guardar este cliente?',
        confirmLabel: 'Sí, guardar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.customersService.saveCustomer(newCustomer).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Cliente guardado correctamente');
          this.getCustomers();
          this.cancelSave();
        },
        error: (error) => {
          console.error('Error al guardar el cliente:', error);
          this.toastService.showErrorToast('Error al guardar el cliente', 'No se pudo guardar el cliente. Por favor, inténtalo de nuevo más tarde.');
        }
      });
    } else if(this.modeForm() === 'update') {
      
      const confirmed = await this.confirmDialogService.confirm({
        title: 'Confirmación',
        message: '¿Estás seguro de que deseas actualizar este cliente?',
        confirmLabel: 'Sí, actualizar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });

      if (!confirmed) {
        return;
      }

      this.customersService.updateCustomer(this.idSelectedCustomer(), newCustomer).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Cliente actualizado correctamente');
          this.getCustomers();
          this.cancelSave();
        },
        error: (error) => {
          console.error('Error al actualizar el cliente:', error);
          this.toastService.showErrorToast('Error al actualizar el cliente', 'No se pudo actualizar el cliente. Por favor, inténtalo de nuevo más tarde.');
        }
      });
    }


  }


  getCustomers(): void {
    const estado = this.showDeleted() ? 'INA' : 'ACT';

    const request = { estado: estado };
    this.customersService.getCustomers(request).subscribe({
      next: (response: any[]) => {
        this.allCustomers.set(response);
        this.tableContent.set(response);
      },
      error: (error) => {
        console.error('Error al obtener los clientes:', error);
        this.toastService.showErrorToast('Error al obtener los clientes', 'No se pudieron cargar los clientes. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }

  editCustomer(event: RowActionEvent<Customer>): void {

    this.modeForm.set('update');
    
    this.idSelectedCustomer.set(event.row.id ?? null);

    this.name.set(event.row.nombre);
    this.lastname.set(event.row.apellido);
    this.email.set(event.row.email);
    this.phone.set(event.row.telefono);
    this.rfc.set(event.row.rfc);
    this.address.set(event.row.direccion);
    this.cp.set(event.row.cp);
    this.estado.set(event.row.estado);
    this.ciudad.set(event.row.ciudad);

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
      lastname: event.row.apellido,
      email: event.row.email,
      phone: event.row.telefono,
      rfc: event.row.rfc,
      address: event.row.direccion,
      cp: event.row.cp,
      idEstado: estadoOption ? estadoOption.id : null,
      idCiudad: ciudadOption ? ciudadOption.id : null
    });

    this.form.markAllAsTouched();

    this.idSelectedCustomer.set(event.row.id ?? null);
 
  }

  async deleteCustomer(event: RowActionEvent<Customer>): Promise<void> {

    if(this.showDeleted()){

      const confirm = await this.confirmDialogService.confirm({
        title: 'Confirmar restauración',
        message: '¿Estás seguro de que deseas restaurar este cliente?',
        confirmLabel: 'Restaurar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }

      this.customersService.restoreCustomer(event.row.id ?? null).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Cliente restaurado');
          this.getCustomers();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al restaurar el cliente', 'No se pudo restaurar el cliente. Por favor, inténtalo de nuevo más tarde.');
        }
      });

    }else{

      const confirm = await this.confirmDialogService.confirm({
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este cliente?',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }

      this.customersService.deleteCustomer(event.row.id ?? null).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Cliente eliminado');
          this.getCustomers();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al eliminar el cliente', 'No se pudo eliminar el cliente. Por favor, inténtalo de nuevo más tarde.');
        }
      }); 
    }

  }




  applySearchFilter(): void {
    /*
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
*/
  }
}
