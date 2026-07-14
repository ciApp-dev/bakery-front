import { Component, computed, inject, signal, input } from '@angular/core';
import { SelectorForm } from "src/app/components/elements/selectors/selector-form/selector-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { ToastService } from 'src/app/service/toast-service';
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { ButtonMainForm } from "src/app/components/elements/buttons/button-main-form/button-main-form";
import { ButtonSecundaryForm } from "src/app/components/elements/buttons/button-secundary-form/button-secundary-form";
import { InventarioService } from 'src/app/service/inventario-service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { productoInterface } from 'src/app/interfaces/invetario-interface';

@Component({
  selector: 'app-entrance-register',
  imports: [SelectorForm, InputForm, ButtonMainForm, ButtonSecundaryForm],
  templateUrl: './entrance-register.html',
  styleUrl: './entrance-register.css',
})
export class EntranceRegister {

  products = input.required<productoInterface[]>();


  // Injects

  toastService = inject(ToastService);
  inventarioService = inject(InventarioService);
  confirmDialog = inject(ConfirmDialogService);

  
  optionsProducts = computed<SelectorOption[]>(() =>
    this.products().map((product) => ({ id: product.id, nombre: product.nombre }))
  );



  form = new FormGroup({
    idProducto: new FormControl<number | null>(null, Validators.required),
    cantidad: new FormControl(0,[Validators.required, Validators.min(1)])
  })
  //signals

  idProducto = signal<number>(0);
  cantidad = signal<number >(0);
  motivo = signal<string >('');
  sucursal = signal<number >(0);
  usuario = signal<number >(0);



onProductSelected(productId: number): void {
  this.idProducto.set(productId);
  console.log('Producto seleccionado:', productId);
}
  
onCantidadChange(value: string | number): void {
  this.cantidad.set(Number(value));
  console.log('Cantidad ingresada:', value);
}

onMotivoChange(value: string | number): void {
  this.motivo.set(String(value));
  console.log('Motivo ingresado:', value);
}



  async save(): Promise<void> {

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

  this.sucursal.set(Number(localStorage.getItem('idSucursal')));
  this.usuario.set(Number(localStorage.getItem('id_user')));

const abastoData = {
  sucursal_id: this.sucursal(),
  producto_id: this.idProducto(),
  cantidad: this.cantidad(),
  motivo: this.motivo() || null,
  user_id: this.usuario()
};


const confirm = await this.confirmDialog.confirm({
title: 'Confirmar Abasto',
message: `¿Está seguro de que desea registrar el abasto del producto con ID ${this.idProducto()}?`,
confirmLabel: 'Sí, registrar',
cancelLabel: 'Cancelar',
destructive: true,
closeOnBackdrop: true,
});

if(!confirm) {
  return;
}

this.inventarioService.abastoSucursal(abastoData).subscribe({
  next: (response) => {
    this.toastService.showSuccessToast('Abasto registrado con éxito');
    // Reset form fields
    this.resetForm();
  },
  error: (error) => {
    console.error('Error al registrar el abasto:', error);
    this.toastService.showErrorToast('Error al registrar el abasto','Por favor, inténtelo de nuevo más tarde.');
  }
});
  
}


cancel(): void {
  this.resetForm();
}

resetForm(): void {

  this.idProducto.set(0);
  this.cantidad.set(0);
  this.motivo.set(''); 
  
}



}
