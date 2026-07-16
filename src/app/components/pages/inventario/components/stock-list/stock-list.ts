import { Component, computed, input, signal } from '@angular/core';
import { productoInterface, stockListInterface } from 'src/app/interfaces/invetario-interface';
import { InputSearchForm } from "src/app/components/elements/inputs/input-search-form/input-search-form";

@Component({
  selector: 'app-stock-list',
  imports: [InputSearchForm],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
})
export class StockList {

  products = input.required<productoInterface[]>();

  sucursal_id = signal<number | null>(localStorage.getItem('idSucursal') ? Number(localStorage.getItem('idSucursal')) : null);

  searchTerm = signal('');

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }


  producList = computed<stockListInterface[]>(() => {
    const sucursalId = this.sucursal_id();

    if (sucursalId === null) {
      return [];
    }

    return this.products().flatMap((producto) =>
      producto.inventario
        .filter((inventario) => inventario.sucursal_id === sucursalId)
        .map((inventario) => ({
          sucursal_id: inventario.sucursal_id,
          nombre: producto.nombre,
          categoria: String(producto.categoria),
          sucursal: inventario.sucursal,
          precio: inventario.precio,
          cantidad: inventario.cantidad,
          descripcion: producto.descripcion,
        }))
    );
  });

  filteredProductList = computed<stockListInterface[]>(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.producList();
    }

    return this.producList().filter((item) =>
      item.nombre.toLowerCase().includes(query) ||
      (item.descripcion?.toLowerCase().includes(query) ?? false) ||
      item.categoria.toLowerCase().includes(query)
    );
  });


  ngOnInit(): void {
    console.log("Lista de productos en stock:", this.producList());
  }


}
