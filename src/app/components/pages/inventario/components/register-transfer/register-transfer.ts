import { Component, input, computed, signal, inject, output } from '@angular/core';
import { ButtonSecundaryForm } from "src/app/components/elements/buttons/button-secundary-form/button-secundary-form";
import { ButtonMainForm } from "src/app/components/elements/buttons/button-main-form/button-main-form";
import { productoInterface, transferenciaInterface } from 'src/app/interfaces/invetario-interface';
import { SelectorOption } from 'src/app/interfaces/forms';
import { SelectorForm } from "src/app/components/elements/selectors/selector-form/selector-form";
import { LabelMedium } from "src/app/components/elements/labels/label-medium/label-medium";
import { LabelSmall } from "src/app/components/elements/labels/label-small/label-small";
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InventarioService } from 'src/app/service/inventario-service';
import { ToastService } from 'src/app/service/toast-service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';

@Component({
  selector: 'app-register-transfer',
  imports: [ButtonSecundaryForm, ButtonMainForm, SelectorForm, LabelMedium, LabelSmall, InputForm],
  templateUrl: './register-transfer.html',
  styleUrl: './register-transfer.css',
})
export class RegisterTransfer {

  inventarioService = inject(InventarioService);
  toastService = inject(ToastService);
  confirmDialog = inject(ConfirmDialogService);

  products = input.required<productoInterface[]>();
  refreshProductsRequested = output<void>();
  selectedProductId = signal<number | null>(null);
  sucursales = input.required<SelectorOption[]>();

  sucursal_id_destino = signal<number | null>(null);
  sucursal_id_local = signal<number | null>(localStorage.getItem('idSucursal') ? Number(localStorage.getItem('idSucursal')) : null);

  producto_id = signal<number | null>(null);

  form = new FormGroup({
    producto_id: new FormControl<number | null>(null, Validators.required),
    cantidad: new FormControl(0,[Validators.required, Validators.min(1)]),
    sucursal_destino_id: new FormControl<number | null>(null, Validators.required),
  });

  isFormValid = signal<boolean>(false);

  optionsProducts = computed<SelectorOption[]>(() =>
    this.products().map((product) => ({ id: product.id, nombre: product.nombre }))
  );

  stockLocal = signal<number>(0);
  stockDestino = signal<number>(0);
  cantidadValue = computed<number>(() => this.form.controls['cantidad'].value ?? 0);

  cancel(): void {
    this.form.reset();
    this.selectedProductId.set(null);
    this.sucursal_id_destino.set(null);
    this.producto_id.set(null);
    this.stockLocal.set(0);
    this.stockDestino.set(0);
  }

  selectProductLocal(productId: number): void {
    this.selectedProductId.set(productId);
    this.form.controls.producto_id.setValue(productId);
    this.form.controls.producto_id.markAsTouched();
    this.calculateStocks();
  }

  onCantidadChange(value: string | number): void {
    const cantidad = Number(value);
    const cantidadControl = this.form.controls['cantidad'];

    cantidadControl.setValue(Number.isFinite(cantidad) ? cantidad : 0);
    this.syncCantidadValidators();
    
    
  }

  private syncCantidadValidators(): void {
    this.form.controls['cantidad'].setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.stockLocal())
    ]);
    this.form.controls['cantidad'].updateValueAndValidity({ emitEvent: false });
  }

  private calculateStock(productId: number | null,sucursalId: number | null): number {
    const selectedProduct = this.products().find(product => product.id === productId);
    this.producto_id.set(selectedProduct ? selectedProduct.id : null);
    return selectedProduct ? selectedProduct.inventario.reduce((total, item) => {
      if (item.sucursal_id.toString() === String(sucursalId)) {
        return total + item.cantidad;
      }
      return total;
    }, 0) : 0;
  }


  selectSucursalDestino(sucursalId: number): void {
    this.sucursal_id_destino.set(sucursalId);
    this.form.controls.sucursal_destino_id.setValue(sucursalId);
    this.form.controls.sucursal_destino_id.markAsTouched();
    this.calculateStocks();
    
  }

  private calculateStocks(): void {
    this.stockLocal.set(this.calculateStock(this.selectedProductId(), this.sucursal_id_local()));
    this.stockDestino.set(this.calculateStock(this.producto_id(), this.sucursal_id_destino()));
    this.syncCantidadValidators();
  }

  async saveTransfer(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const transferData: transferenciaInterface = {
      producto_id: Number(this.producto_id()),
      cantidad: Number(this.form.controls['cantidad'].value),
      sucursal_origen_id: Number(this.sucursal_id_local()),
      sucursal_destino_id: Number(this.sucursal_id_destino()),
      user_id: Number(localStorage.getItem('id_user'))
    };

    const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar transferencia',
      message: `¿Está seguro de transferir ${transferData.cantidad} unidades del producto seleccionado a la sucursal destino?`,
      confirmLabel: 'Sí, transferir',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true
    });
    
    if (!confirm) {
      return;
    }
    this.inventarioService.transferProduct(transferData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Transferencia registrada');
        this.refreshProductsRequested.emit();
        this.cancel();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al registrar la transferencia', error.message);
        
      }
    });

    
  }

}
