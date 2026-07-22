import { Component, inject,signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { environment } from '@environments/environment';
import { InfoCards } from "../../elements/cards/info-cards/info-cards";
import { EntranceRegister } from "./components/entrance-out-register/entrance-out-register";
import { InventarioTab, SelectorOption } from 'src/app/interfaces/forms';
import { RegisterTransfer } from "./components/register-transfer/register-transfer";
import { statusRequest } from 'src/app/interfaces/request';
import { productoInterface } from 'src/app/interfaces/invetario-interface';
import { InventarioService } from 'src/app/service/inventario-service';
import { ToastService } from 'src/app/service/toast-service';
import { SucursalesService } from 'src/app/service/sucursales-service';
import { StockList } from "./components/stock-list/stock-list";
import { Registers } from "./components/registers/registers";


@Component({
  selector: 'app-inventario',
  imports: [NgClass, InfoCards, EntranceRegister, RegisterTransfer, StockList, Registers],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class InventarioComponent {

  inventarioService = inject(InventarioService);
  toastService = inject(ToastService);
  sucursalesService = inject(SucursalesService);

  products = signal<productoInterface[]>([]);
  sucursales = signal<SelectorOption[]>([]);

  readonly tabs: Array<{ id: InventarioTab; label: string }> = [
    { id: 'produccion', label: 'Producción' },
    { id: 'abasto', label: 'Abasto a Sucursal' },
    { id: 'salidas', label: 'Salidas' },
    { id: 'stock', label: 'Stock' },
    { id: 'pendientes', label: 'Pendientes' },
    { id: 'reportes', label: 'Reportes' },
  ];
  
  readonly activeTab = signal<InventarioTab>('produccion');

  cardTextColor = environment.cardTextColor;
  cardTextBadColor = environment.cardTextColorBad;
  cardTextWarningColor = environment.cardTextColorWarning;


  ngOnInit(): void {
    this.getProducts();
    this.getSucursales();
  }

  selectTab(tab: InventarioTab): void {
    this.activeTab.set(tab);
  }

  isActiveTab(tab: InventarioTab): boolean {
    return this.activeTab() === tab;
  }



  getProducts(): void {
    const estado: statusRequest  ={
      estado: 'ACT'
    }


    this.inventarioService.getProducts(estado).subscribe({
      next: (productos) => {
        this.products.set(productos);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.toastService.showErrorToast('Error al obtener productos', error.message);
      }
    });
  }

  getSucursales(): void {
    const estado: statusRequest  ={
      estado: 'ACT'
    }
    this.sucursalesService.getSucursales(estado).subscribe({
      next: (sucursales) => {
        this.sucursales.set(sucursales.map(sucursal => ({ id: sucursal.id, nombre: sucursal.nombre })));
      },
      error: (error) => {
        console.error('Error al obtener sucursales:', error);
        this.toastService.showErrorToast('Error al obtener sucursales', error.message);
      }
    });
  }

}

