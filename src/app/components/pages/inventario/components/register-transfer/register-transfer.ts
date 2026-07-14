import { Component, input, computed, signal } from '@angular/core';
import { ButtonSecundaryForm } from "src/app/components/elements/buttons/button-secundary-form/button-secundary-form";
import { ButtonMainForm } from "src/app/components/elements/buttons/button-main-form/button-main-form";
import { productoInterface } from 'src/app/interfaces/invetario-interface';
import { SelectorOption } from 'src/app/interfaces/forms';
import { SelectorForm } from "src/app/components/elements/selectors/selector-form/selector-form";
import { LabelForm } from "src/app/components/elements/labels/label-form/label-form";
import { LabelMedium } from "src/app/components/elements/labels/label-medium/label-medium";
import { LabelSmall } from "src/app/components/elements/labels/label-small/label-small";

@Component({
  selector: 'app-register-transfer',
  imports: [ButtonSecundaryForm, ButtonMainForm, SelectorForm, LabelForm, LabelMedium, LabelSmall],
  templateUrl: './register-transfer.html',
  styleUrl: './register-transfer.css',
})
export class RegisterTransfer {

  products = input.required<productoInterface[]>();
  selectedProductId = signal<number | null>(null);
  sucursales = input.required<SelectorOption[]>();


  optionsProducts = computed<SelectorOption[]>(() =>
    this.products().map((product) => ({ id: product.id, nombre: product.nombre }))
  );

  stockLocal = signal<number>(0);


  cancel(): void {
    console.log('Cancel button clicked');
  }

  save(): void {
    console.log('Save button clicked');
  }

  selectProductLocal(productId: number): void {
    this.selectedProductId.set(productId);

    this.stockLocal.set(this.calculateStockLocal(productId));
  }

  private calculateStockLocal(productId: number): number {
    const selectedProduct = this.products().find(product => product.id === productId);
    const sucursalId = localStorage.getItem('idSucursal');
    return selectedProduct ? selectedProduct.inventario.reduce((total, item) => {
      if (item.sucursal_id.toString() === sucursalId) {
        return total + item.cantidad;
      }
      return total;
    }, 0) : 0;
  }

}
