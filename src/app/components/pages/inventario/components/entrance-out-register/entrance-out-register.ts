import { Component, computed, inject, signal, input,output } from '@angular/core';
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
import { LabelMedium } from "src/app/components/elements/labels/label-medium/label-medium";

@Component({
  selector: 'app-entrance-out-register',
  imports: [SelectorForm, InputForm, ButtonMainForm, ButtonSecundaryForm, LabelMedium],
  templateUrl: './entrance-out-register.html',
  styleUrl: './entrance-out-register.css',
})
export class EntranceRegister {

  products = input.required<productoInterface[]>();
  tipoRegistro = input.required<'entrada' | 'salida'>();

  refreshProductsRequested = output<void>();
  // Injects

  toastService = inject(ToastService);
  inventarioService = inject(InventarioService);
  confirmDialog = inject(ConfirmDialogService);

  localStock = signal<number>(0);

  
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

  titleLabel = computed<string>(() => {
    if (this.tipoRegistro() === 'entrada') {
      return 'producción';
    } else if (this.tipoRegistro() === 'salida') {
      return 'salida';
    } else {
      return '';
    }
  });



onProductSelected(productId: number): void {
  this.idProducto.set(productId);
  this.calculateLocalStock(productId);
  this.form.controls.idProducto.setValue(productId);
}
  
onCantidadChange(value: string | number): void {
  this.cantidad.set(Number(value));
  const cantidadControl = this.form.controls['cantidad'];
  cantidadControl.setValue(Number(value));
  cantidadControl.markAsTouched();
  
  if(this.tipoRegistro() === 'salida') {
    this.syncCantidadValidators();
  }

}

onMotivoChange(value: string | number): void {
  this.motivo.set(String(value));
  
}


private syncCantidadValidators(): void {
  this.form.controls['cantidad'].setValidators([
    Validators.required,
    Validators.min(1),
    Validators.max(this.localStock())
  ]);
  this.form.controls['cantidad'].updateValueAndValidity();
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

const productName = this.getNamebyId(this.idProducto());
const message = this.tipoRegistro() === 'entrada' ?
  `¿Está seguro de que desea registrar la entrada de ${this.cantidad()} unidades del producto ${productName}?` :
  `¿Está seguro de que desea registrar la salida de ${this.cantidad()} unidades del producto ${productName}?`;

const confirm = await this.confirmDialog.confirm({
title: 'Confirmar Registro',
message: message,
confirmLabel: 'Sí, registrar',
cancelLabel: 'Cancelar',
destructive: true,
closeOnBackdrop: true,
});

if(!confirm) {
  return;
}

if(this.tipoRegistro() === 'entrada') {


this.inventarioService.abastoSucursal(abastoData).subscribe({
  next: (response) => {
    this.toastService.showSuccessToast('Abasto registrado con éxito');
    // Reset form fields
    this.refreshProductsRequested.emit();

    this.resetForm();
  },
  error: (error) => {
    console.error('Error al registrar el abasto:', error);
    this.toastService.showErrorToast('Error al registrar el abasto','Por favor, inténtelo de nuevo más tarde.');
  }
});

}else{


  this.inventarioService.outRegister(abastoData).subscribe({
    next: (response) => {
      this.toastService.showSuccessToast('Salida registrada con éxito');
      this.refreshProductsRequested.emit();
      // Reset form fields
      this.resetForm();
    },
    error: (error) => {
      console.error('Error al registrar la salida:', error);
      this.toastService.showErrorToast('Error al registrar la salida','Por favor, inténtelo de nuevo más tarde.');
    }
  });


}


  
}


cancel(): void {
  this.resetForm();
}

resetForm(): void {

  this.form.reset();
  this.idProducto.set(0);
  this.cantidad.set(0);
  this.motivo.set(''); 
  this.localStock.set(0);
  
}

private calculateLocalStock(productId: number): void {
  const selectedProduct = this.products().find(product => product.id === productId);
  this.localStock.set(selectedProduct ? selectedProduct.inventario.reduce((total, iten) => {
    if (iten.sucursal_id.toString() === String(localStorage.getItem('idSucursal'))) {
      return total + iten.cantidad;
    }
    return total;
  }, 0) : 0);

}


getNamebyId(id: number): string | undefined {
  const producto = this.optionsProducts().find(p => p.id === id);
  return producto ? producto.nombre : 'Producto no encontrado';
}

}
