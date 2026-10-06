import { Component, signal } from '@angular/core';
import { InventarioComponent } from '../inventario/inventario';
import { ProductsCategoriesComponent } from "./components/products-categories/products-categories";
import { PaymentsCategories } from "./components/payments-categories/payments-categories";
import { RolCategoriesComponent } from './components/rol-categories/rol-categories';
import { RolPermissionsCategoriesComponent } from './components/rol-permissions-categories/rol-permissions-categories';


interface AccordionItem {
  id: number;
  title: string;
  
}

@Component({
  selector: 'app-catalogs',
  imports: [ProductsCategoriesComponent, PaymentsCategories, RolCategoriesComponent, RolPermissionsCategoriesComponent],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.css',
})
export class CatalogsComponent {
  protected readonly items: AccordionItem[] = [
    {
      id: 1,
      title: 'Categorias de Productos',
      
    },
    {
      id: 2,
      title: 'Metodos de pago',
      
    },
    {
      id: 3,
      title: 'Roles',
    },
    {
      id: 4,
      title: 'Permisos para Roles'
    }
  ];

  protected readonly openItemId = signal<number>(1);

  protected toggleItem(itemId: number): void {
    this.openItemId.update((current) => (current === itemId ? 0 : itemId));
  }
}
