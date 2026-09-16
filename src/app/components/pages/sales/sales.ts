import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { ActivityStartResponse, ActivityUserRequest, StartedResgister } from 'src/app/interfaces/actividades-interface';
import { ActivitiesService } from 'src/app/service/activities-service';
import { ToastService } from 'src/app/service/toast-service';
import { ProductTableRow, SelectorOption } from 'src/app/interfaces/forms';
import { statusRequest } from 'src/app/interfaces/request';
import { CategoriaService } from 'src/app/service/categoria-service';
import { ProductosService } from 'src/app/service/productos-service';
import { InventoryProductData, ProductSales } from 'src/app/interfaces/products-interfaces';
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";
import { CustomersService } from 'src/app/service/customers-service';
import { Customer } from 'src/app/interfaces/customers-interface';
import { InputForm } from "../../elements/inputs/input-form/input-form";
import { PaymentsService } from 'src/app/service/payments-service';
import { PaymentMethod } from 'src/app/interfaces/payment-interface';
import { PosService } from 'src/app/service/pos-service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { Sell, SaleTab, payments } from 'src/app/interfaces/pos-interface';







@Component({
  selector: 'app-sales',
  imports: [SelectorForm, InputForm],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {

 varDarkModeDiv = environment.darkModeDiv;
 varDarkModeCardText = environment.cardTextColor;

  activityService = inject(ActivitiesService);
  confirmDialogService = inject(ConfirmDialogService);
  toastService = inject(ToastService);
  categoriaService = inject(CategoriaService);
  productService = inject(ProductosService);
  customerService = inject(CustomersService);
  paymentsService = inject(PaymentsService);
  posService = inject(PosService);

  actividadId = signal<number>(Number(localStorage.getItem('actividad_id')) || 0);
  router = inject(Router);

  idCustomer = signal<number>(0);
  idPaymentMethod = signal<number>(0);

  protected readonly darkModeDiv = environment.darkModeDiv;
  protected readonly cardTextColor = environment.cardTextColor;
  protected readonly cardTextColorGood = environment.cardTextColorGood;
  protected readonly cardTextColorBad = environment.cardTextColorBad;
  protected readonly cardTextColorWarning = environment.cardTextColorWarning;

  categories = signal<SelectorOption[]>([]);

  //protected readonly categories = ['Todos', 'Pan Dulce', 'Pan Salado', 'Pasteles', 'Bebidas'];
  protected readonly quickAmounts = [50, 100, 200, 500];

  catalogo = signal<ProductSales[]>([]);

  /*protected readonly catalogo = signal<Producto[]>([
    { id: 1, nombre: 'Concha Chocolate', precio: 15, categoria: 'Pan Dulce', icono: 'CO' },
    { id: 2, nombre: 'Cuerno de Mantequilla', precio: 18, categoria: 'Pan Dulce', icono: 'CU' },
    { id: 3, nombre: 'Bolillo Rustico', precio: 5, categoria: 'Pan Salado', icono: 'BO' },
    { id: 4, nombre: 'Baguette', precio: 25, categoria: 'Pan Salado', icono: 'BA' },
    { id: 5, nombre: 'Pastel Tres Leches', precio: 220, categoria: 'Pasteles', icono: 'PA' },
    { id: 6, nombre: 'Cafe Americano', precio: 30, categoria: 'Bebidas', icono: 'CA' },
    { id: 7, nombre: 'Rosca Azucar', precio: 28, categoria: 'Pan Dulce', icono: 'RO' },
    { id: 8, nombre: 'Dona Glaseada', precio: 16, categoria: 'Pan Dulce', icono: 'DO' },
  ]);*/

  protected readonly saleTabs = signal<SaleTab[]>([
    {
      id: 1,
      title: 'Venta 1',
      customerId: 0,
      customerName: 'Cliente Predeterminado',
      customerPhone: '',
      customerEmail: '',
      payments: [],
      receivedAmount: 0,
      discount: 0,
      cart: [],
      comments: '',
    },
  ]);

  protected readonly activeTabId = signal(1);
  private readonly nextTabId = signal(2);
  protected readonly searchText = signal('');
  protected readonly activeCategory = signal('Todos');


  customerOptions = signal<SelectorOption[]>([]);
  paymentMethodOptions = signal<PaymentMethod[]>([]);



  constructor() {
    this.validateActivityStart();
    this.getCategories();
    this.getProducts();
    this.getCustomerOptions();
    this.getPaymentMethodOptions();
  }

  protected readonly activeTab = computed(() => {
    const activeId = this.activeTabId();
    return this.saleTabs().find((tab) => tab.id === activeId) ?? this.saleTabs()[0];
  });

  protected readonly filteredProducts = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const category = this.activeCategory();

    return this.catalogo().filter((producto) => {
      const matchCategory = category === 'Todos' || producto.categoria === category;
      const matchText = text.length === 0 || producto.nombre.toLowerCase().includes(text);
      return matchCategory && matchText;
    });
  });

  protected readonly subtotal = computed(() => {
    const tab = this.activeTab();
    if (!tab) {
      return 0;
    }
    return tab.cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  });

  protected readonly total = computed(() => {
    const tab = this.activeTab();
    if (!tab) {
      return 0;
    }
    return Math.max(0, this.subtotal() - tab.discount);
  });

  protected readonly change = computed(() => {
    const tab = this.activeTab();
    if (!tab) {
      return 0;
    }
    return Math.max(0, tab.receivedAmount - this.total());
  });

  protected selectTab(tabId: number): void {
    this.activeTabId.set(tabId);
  }

  protected addTab(): void {
    const tabId = this.nextTabId();
    const newTab: SaleTab = {
      id: tabId,
      title: `Venta ${tabId}`,
      customerId: 0,
      customerName: 'Cliente nuevo',
      customerPhone: '',
      customerEmail: '',
      payments: [],
      receivedAmount: 0,
      discount: 0,
      cart: [],
      comments: '',
    };

    this.saleTabs.update((tabs) => [...tabs, newTab]);
    this.activeTabId.set(tabId);
    this.nextTabId.update((id) => id + 1);
  }

  protected closeTab(tabId: number): void {
    const tabs = this.saleTabs();
    if (tabs.length === 1) {
      return;
    }

    const targetIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (targetIndex === -1) {
      return;
    }

    const remaining = tabs.filter((tab) => tab.id !== tabId);
    this.saleTabs.set(remaining);

    if (this.activeTabId() === tabId) {
      const fallbackIndex = Math.max(0, targetIndex - 1);
      this.activeTabId.set(remaining[fallbackIndex].id);
    }
  }

  protected setSearch(value: string): void {
    this.searchText.set(value);
  }

  protected setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  protected addToCart(producto: ProductSales): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    if(producto.stock <= 0) {
      this.toastService.showErrorToast('Producto sin stock', `El producto "${producto.nombre}" no tiene stock disponible.`);
      return;
    }

    const existing = tab.cart.find((item) => item.producto.id === producto.id);
    if (existing) {
      if (existing.cantidad >= producto.stock) {
        this.toastService.showErrorToast('Stock insuficiente', `Solo hay ${producto.stock} unidad(es) disponibles de "${producto.nombre}".`);
        return;
      }

      const updated = tab.cart.map((item) =>
        item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.producto.precio } : item,
      );
      this.patchTab({ cart: updated });
      return;
    }

    this.patchTab({ cart: [...tab.cart, { producto, cantidad: 1, subtotal: producto.precio }] });
  }

  protected updateQty(productoId: number, delta: number): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    const updated = tab.cart
      .map((item) => {
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
      .filter((item) => item.cantidad > 0);

    this.patchTab({ cart: updated });
  }

  protected removeItem(productoId: number): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    this.patchTab({ cart: tab.cart.filter((item) => item.producto.id !== productoId) });
  }

  protected clearCart(): void {
    this.patchTab({ cart: [], receivedAmount: 0 });
  }

  protected setQuickAmount(value: number): void {
    this.patchTab({ receivedAmount: value });
  }

  onCommentsChange(value: string | number): void {
    this.patchTab({ comments: value.toString() });
  }

  onCustomerChange(value: number): void {
    const parsedValue = value > 0 ? value : 0;
    this.idCustomer.set(parsedValue);
    this.patchTab({ customerId: parsedValue });
    this.getCustomerInfo(parsedValue); //We fetch the customer information based on the selected customer ID.
  }

  onPaymentMethodChange(value: number): void {
    console.log('onPaymentMethodChange called with value:', value);
    const parsedValue = value > 0 ? value : 0;
    this.idPaymentMethod.set(parsedValue);
      const metodo = this.paymentMethodOptions().find(option => option.id === parsedValue)?.nombre || '';

      const payment: payments = {
        metodo_pago_id: parsedValue,
        metodo: metodo,
        monto: 0,
        referencia: 'testing',
      };
      console.log('test payment', payment);
      this.patchTab({ payments: [payment] });
  }

  onPaymentChange(id: number, name:string, amount: number, reference: string): void {
    const tab = this.activeTab();
    if (!tab) {
      return;
    }

    const updatedPayments = tab.payments.map((payment) =>
      payment.metodo_pago_id === id ? { ...payment, metodo: name, monto: amount, referencia: reference } : payment
    );

    this.patchTab({ payments: updatedPayments });
  }

  getCustomerInfo(customerId: number): void {
    if (customerId > 0) {
      this.customerService.getCustomer(customerId).subscribe({
        next: (customer: Customer) => {
          this.patchTab({
            customerName: customer.nombre,
            customerPhone: customer.telefono,
            customerEmail: customer.email,
          });
        },
        error: () => {
          this.toastService.showErrorToast('Error', 'No se pudo obtener la información del cliente.');
        },
      });
    }
  }

  
  protected setExactAmount(): void {
    this.patchTab({ receivedAmount: this.total() });
  }

  protected setCustomerName(value: string): void {
    this.patchTab({ customerName: value });
  }

  protected setCustomerPhone(value: string): void {
    this.patchTab({ customerPhone: value });
  }

  protected setCustomerEmail(value: string): void {
    this.patchTab({ customerEmail: value });
  }

  protected setReceivedAmount(value: string): void {
    const amount = Number(value);
    this.patchTab({ receivedAmount: Number.isFinite(amount) && amount > 0 ? amount : 0 });
  }

  protected setDiscount(value: string): void {
    const amount = Number(value);
    this.patchTab({ discount: Number.isFinite(amount) && amount > 0 ? amount : 0 });
  }

  private patchTab(patch: Partial<SaleTab>): void {
    const currentId = this.activeTabId();
    this.saleTabs.update((tabs) => tabs.map((tab) => (tab.id === currentId ? { ...tab, ...patch } : tab)));
  }


  validateActivityStart(): void {
       
       if(this.actividadId() === null || this.actividadId() === undefined || this.actividadId() === 0) {
        this.getActivityByUser();
        
      }

      if(this.actividadId() === null || this.actividadId() === undefined || this.actividadId() === 0) {

          this.getActivityByUser();
          

        this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
        this.router.navigate(['dashboard/summary']);
        return;

        
      }else {

      if(!this.actividadId() || isNaN(Number(this.actividadId()))) {
        this.router.navigate(['dashboard/summary']);
        localStorage.removeItem('actividad_id');
        localStorage.removeItem('nombre_caja');
        localStorage.removeItem('caja_id');
        this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
        return;
      }
  
      this.activityService.getActivityInfo(Number(this.actividadId())).subscribe({
        next: (response: ActivityStartResponse) => {
          if (response.estado === 'ACT') {
            
          } else {
            this.router.navigate(['dashboard/summary']);
            localStorage.removeItem('actividad_id');
            localStorage.removeItem('nombre_caja');
            localStorage.removeItem('caja_id');
            this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
          }   
        },
        error: (response: any) => {
          this.router.navigate(['dashboard/summary']);
          localStorage.removeItem('actividad_id');
          localStorage.removeItem('nombre_caja');
          localStorage.removeItem('caja_id');
          this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
        }
      }); 
    }
  }

  getActivityByUser(): void {
    const userId = localStorage.getItem('id_user');

    const data: ActivityUserRequest = {
      usuario_id: Number(userId),
      sucursal_id: Number(localStorage.getItem('idSucursal')) || 0
    };
    
    if(userId === null || userId === undefined || userId === '') {
      this.router.navigate(['login']);
      return;
  }



    this.activityService.getActivityByUser(data).subscribe({
      next: (response: StartedResgister) => {
        if (response && response.actividad_id) {
          localStorage.setItem('actividad_id', response.actividad_id.toString());
          localStorage.setItem('nombre_caja', response.nombre);
          localStorage.setItem('caja_id', response.caja_id.toString());
        } else {
          this.router.navigate(['dashboard/summary']);
          localStorage.removeItem('actividad_id');
          localStorage.removeItem('nombre_caja');
          localStorage.removeItem('caja_id');
          this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
        }
      },
      error: (response: any) => {
        this.router.navigate(['dashboard/summary']);
        localStorage.removeItem('actividad_id');
        localStorage.removeItem('nombre_caja');
        localStorage.removeItem('caja_id');
        this.toastService.showErrorToast('Actividad inválida o no encontrada', 'La actividad que intentas acceder no es válida o no se encuentra disponible.');
      }
    }); 
  }


   getCategories(): void {
      const estado: statusRequest  ={
        estado: 'ACT'
      }
      this.categoriaService.getCategorias(estado).subscribe({
        next: (categories) => {
          console.log('Fetched categories:', categories);
          this.categories.set(categories.map(category => ({ id: category.id, nombre: category.nombre })));
          this.categories.update((cats) => [{ id: 0, nombre: 'Todos' }, ...cats]);
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    } 

    getProducts(): void {
      const estado: statusRequest  ={
        estado: 'ACT'
      }
      this.productService.getProducts(estado).subscribe({
        next: (products) => {
          console.log('Fetched products:', products);
          this.catalogo.set(products.map(product => ({
            id: product.id,
            nombre: product.nombre,
            precio: Number(product.inventario[0]?.precio) || 0,
            categoria: product.categoria,
            icono: this.convertToIcon(product.nombre), // Assuming you have a function to convert product name to icon
            stock: this.getStockForProduct(product.inventario ?? []),
          })));
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    }

    getCustomerOptions(): void {
      const estado: statusRequest = {
        estado: 'ACT'
      };
      this.customerService.getCustomers(estado).subscribe({
        next: (response: Customer[]) => {
          this.customerOptions.set(response.map(customer => ({ id: customer.id ?? 0, nombre: customer.nombre })));
        },
        error: (error) => {
          console.error('Error fetching customers:', error);
        }
      });
    }

    getPaymentMethodOptions(): void {
      const estado: statusRequest = {
        estado: 'ACT'
      };
      this.paymentsService.getPaymentCategories(estado).subscribe({
        next: (methods: PaymentMethod[]) => {
          const data = {id: 0, nombre: 'Varios'};
          this.paymentMethodOptions.set(
            [data, ...methods.map(method => ({ id: method.id, nombre: method.nombre }))]);
        },
        error: (error) => {
          console.error('Error fetching payment methods:', error);
        }
      });
    }

    convertToIcon(productName: string): string {
      // Implement your logic to convert product name to icon representation
      // For example, you can return the first two letters of the product name as an icon
      return productName.substring(0, 2).toUpperCase();
    } 

    getStockForProduct(inventory?: InventoryProductData[] | null): number {
      if (!Array.isArray(inventory) || inventory.length === 0) {
        return 0;
      }

      const idSucursal = String(Number(localStorage.getItem('idSucursal')) || 0);
      const stock = inventory.find((item) => String(item.sucursal_id) === idSucursal);
      return Number(stock?.cantidad ?? 0);
    }


    testPrint(): void {
      const activeTab = this.activeTab();
      if (!activeTab) {
        return;
      }
      this.posService.printTicket(activeTab).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ticket.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error printing ticket:', error);
        }
      });
    }


    async sendSale(): Promise<void> {
      const confirmed = await this.confirmDialogService.confirm({
        title: 'Confirmar venta',
        message: '¿Está seguro de que desea realizar la venta?',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });
      if (!confirmed) {
        return;
      }
      
      const data: Sell = {
        sucursal_id: Number(localStorage.getItem('idSucursal')) || 0,
        cliente_id: Number(this.activeTab()?.customerId ?? 0),
        user_id: Number(localStorage.getItem('id_user')) || 0,
        caja_actividad_id: Number(localStorage.getItem('caja_id')) || 0,
        total: this.total(),
        productos: this.activeTab()?.cart?.map(item => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          precio: item.producto.precio,
          subtotal: item.subtotal,
          descuento: 0, // Feature to add discount per product in the future
          total: item.subtotal,
        })) ?? [],
        comentarios: this.activeTab()?.comments ?? '',
        payments: this.activeTab()?.payments ?? []
        
      };


      console.log('Sending sale with data:', data);
    }

      }