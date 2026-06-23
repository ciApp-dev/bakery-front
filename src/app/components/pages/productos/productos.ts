import { Component, computed, inject, signal } from '@angular/core';
import { PermissionsService } from 'src/app/service/permissions-service';
import { InputLabel } from "../../elements/inputs/input-label/input-label";
import { InputSearchForm } from "../../elements/inputs/input-search-form/input-search-form";
import { ButtonMainForm } from "../../elements/buttons/button-main-form/button-main-form";


type ProductTableRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

@Component({
  selector: 'app-productos',
  imports: [InputLabel, InputSearchForm, ButtonMainForm],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent {

  permissionns = inject(PermissionsService);
  showCreateSection = signal(false);
  currentPage = signal(1);
  readonly pageSize = 5;

  readonly test = signal('test');

  onTestChange(value: string): void {
    this.test.set(value);
  }
  productRows: ProductTableRow[] = [
    { id: 1, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, stock: 24 },
    { id: 2, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, stock: 41 },
    { id: 3, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, stock: 17 },
    { id: 4, name: 'Croissant', category: 'Bakery', price: 4.1, stock: 32 },
     { id: 1, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, stock: 24 },
    { id: 2, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, stock: 41 },
    { id: 3, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, stock: 17 },
    { id: 4, name: 'Croissant', category: 'Bakery', price: 4.1, stock: 32 },
     { id: 1, name: 'Sourdough Bread', category: 'Bakery', price: 6.5, stock: 24 },
    { id: 2, name: 'Vanilla Cupcake', category: 'Pastry', price: 3.2, stock: 41 },
    { id: 3, name: 'Chocolate Donut', category: 'Dessert', price: 2.8, stock: 17 },
    { id: 4, name: 'Croissant', category: 'Bakery', price: 4.1, stock: 32 },
  ];
  totalPages = computed(() => Math.max(1, Math.ceil(this.productRows.length / this.pageSize)));
  paginatedRows = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;

    return this.productRows.slice(startIndex, startIndex + this.pageSize);
  });

  constructor() {
     console.log(this.permissionns.permissions());
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }
}
