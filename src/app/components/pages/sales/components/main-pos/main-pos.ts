import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ToastService } from 'src/app/service/toast-service';
import { InventoryProductData, ProductSales } from 'src/app/interfaces/products-interfaces';
import { SelectorOption } from 'src/app/interfaces/forms';
import { statusRequest } from 'src/app/interfaces/request';
import { CategoriaService } from 'src/app/service/categoria-service';
import { ProductosService } from 'src/app/service/productos-service';
import { environment } from '@environments/environment';
import { InputForm } from 'src/app/components/elements/inputs/input-form/input-form';
import { SelectorForm } from 'src/app/components/elements/selectors/selector-form/selector-form';
import { Payments } from 'src/app/components/pages/sales/components/payments/payments';
import { payments, SaleTab } from 'src/app/interfaces/pos-interface';
import { CustomersService } from 'src/app/service/customers-service';
import { Customer } from 'src/app/interfaces/customers-interface';
import { ItemCarrito } from 'src/app/interfaces/pos-interface';
import { PaymentCategory } from 'src/app/interfaces/payment-interface';

@Component({
  selector: 'app-main-pos',
  imports: [InputForm, SelectorForm, Payments],
  templateUrl: './main-pos.html',
  styleUrl: './main-pos.css',
})
export class MainPos {


  cardTextColor = environment.cardTextColor;
  cardTextColorGood = environment.cardTextColorGood;
  cardTextColorBad = environment.cardTextColorBad;
  cardTextColorWarning = environment.cardTextColorWarning;

 varDarkModeDiv = environment.darkModeDiv;
 varDarkModeCardText = environment.cardTextColor;

  //###### Service

  categoriaService = inject(CategoriaService);
  productService = inject(ProductosService);
  toastService = inject(ToastService);
  customerService = inject(CustomersService);



  //###### Signals for categories and catalog
  
  categories = input.required<SelectorOption[]>();
  catalogo = input.required<ProductSales[]>();
  paymentMethodOptions = input.required<PaymentCategory[]>(); 
  resetPayment = input(false);
  
  customerOptions = signal<SelectorOption[]>([]);
  quickAmounts = [50, 100, 200, 500];
  private readonly hasMissingRequiredReference = signal(false);

  readonly saleSubmit = output<void>();
  readonly tabPatch = output<Partial<SaleTab>>();
  readonly tab = input.required<SaleTab>();


  activeCategory = signal('Todos');
  searchText = signal('');

  protected readonly activeTab = computed(() => this.tab());
  protected readonly subtotal = computed(() =>
    this.activeTab().cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0),
  );
  protected readonly total = computed(() => Math.max(0, this.subtotal() - this.activeTab().discount));
  protected readonly canSubmitSale = computed(() => {
    const tab = this.activeTab();
    return tab.customerId > 0 && this.total() > 0 && tab.receivedAmount >= this.total() && !this.hasMissingRequiredReference();
  });

  constructor() {
    this.getCustomerOptions();
  }

  protected setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  protected readonly filteredProducts = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const category = this.activeCategory();

    return this.catalogo().filter((producto) => {
      const matchCategory = category === 'Todos' || producto.categoria === category;
      const matchText = text.length === 0 || producto.nombre.toLowerCase().includes(text);
      return matchCategory && matchText;
    });
  });


  protected addToCart(producto: ProductSales): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    if(producto.stock <= 0) {
      this.toastService.showErrorToast('Producto sin stock', `El producto "${producto.nombre}" no tiene stock disponible.`);
      return;
    }

    const existing = tab.cart.find((item: ItemCarrito) => item.producto.id === producto.id);
    if (existing) {
      if (existing.cantidad >= producto.stock) {
        this.toastService.showErrorToast('Stock insuficiente', `Solo hay ${producto.stock} unidad(es) disponibles de "${producto.nombre}".`);
        return;
      }

      const updated = tab.cart.map((item: ItemCarrito) =>
        item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.producto.precio } : item,
      );
      this.patchTab({ cart: updated });
      return;
    }

    this.patchTab({ cart: [...tab.cart, { producto, cantidad: 1, subtotal: producto.precio }] });
  }

  protected clearCart(): void {
    this.patchTab({ cart: [], receivedAmount: 0 });
  }

  onCommentsChange(value: string | number): void {
    this.patchTab({ comments: String(value ?? '') });
  }

  onCustomerChange(value: number): void {
    const parsedValue = value > 0 ? value : 0;
    this.patchTab({ customerId: parsedValue });
    this.getCustomerInfo(parsedValue);
  }

  onPaymentsChange(paymentData: payments[]): void {
    this.patchTab({ pagos: paymentData });
  }

  onReceivedAmountChange(amount: number): void {
    this.patchTab({ receivedAmount: amount });
  }

  onMissingReferenceValidationChange(hasMissing: boolean): void {
    this.hasMissingRequiredReference.set(hasMissing);
  }

  protected clearPaymentsAndRefreshStock(): void {
    this.patchTab({
      pagos: [],
      receivedAmount: 0,
    });
    this.hasMissingRequiredReference.set(false);
    
  }

  sendSale(): void {
    const tab = this.activeTab();

    if (tab.customerId <= 0) {
      this.toastService.showErrorToast('Cliente requerido', 'Seleccione un cliente antes de cobrar.');
      return;
    }

    if (this.total() <= 0) {
      this.toastService.showErrorToast('Venta vacia', 'Agregue al menos un producto para cobrar.');
      return;
    }

    if (tab.receivedAmount < this.total()) {
      this.toastService.showErrorToast('Monto insuficiente', 'El monto recibido debe ser igual o mayor al total.');
      return;
    }

    if (this.hasMissingRequiredReference()) {
      this.toastService.showErrorToast('Referencia requerida', 'Complete la referencia en los metodos de pago que la requieren.');
      return;
    }

    this.saleSubmit.emit();
  }





  protected updateQty(productoId: number, delta: number): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    const updated = tab.cart
      .map((item: ItemCarrito) => {
        if (item.producto.id !== productoId) {
          return item;
        }

        const nextQty = item.cantidad + delta;
        if (delta > 0 && nextQty > item.producto.stock) {
          this.toastService.showErrorToast('Stock insuficiente', `Solo hay ${item.producto.stock} unidad(es) disponibles de "${item.producto.nombre}".`);
          return item;
        }

        return {
          ...item,
          cantidad: Math.max(0, Math.min(item.producto.stock, nextQty)),
          subtotal: nextQty * item.producto.precio,
        };
      })
      .filter((item: ItemCarrito) => item.cantidad > 0);

    this.patchTab({ cart: updated });
  }


  protected removeItem(productoId: number): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    this.patchTab({ cart: tab.cart.filter((item: ItemCarrito) => item.producto.id !== productoId) });
  }

  private patchTab(patch: Partial<SaleTab>): void {
    this.tabPatch.emit(patch);
  }

  private getCustomerOptions(): void {
    const estado: statusRequest = {
      estado: 'ACT',
    };

    this.customerService.getCustomers(estado).subscribe({
      next: (response: Customer[]) => {
        this.customerOptions.set(response.map((customer) => ({ id: customer.id ?? 0, nombre: customer.nombre })));
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
      },
    });
  }

  private getCustomerInfo(customerId: number): void {
    if (customerId <= 0) {
      this.patchTab({ customerPhone: '', customerEmail: '' });
      return;
    }

    this.customerService.getCustomer(customerId).subscribe({
      next: (customer: Customer) => {
        this.patchTab({
          customerName: customer.nombre,
          customerPhone: customer.telefono,
          customerEmail: customer.email,
        });
      },
      error: () => {
        this.toastService.showErrorToast('Error', 'No se pudo obtener la informacion del cliente.');
      },
    });
  }
}
