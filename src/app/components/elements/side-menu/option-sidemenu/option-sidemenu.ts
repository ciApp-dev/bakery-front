import { Component,input,output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type DashboardNavItem = {
  path: string;
  label: string;
};
@Component({
  selector: 'app-option-sidemenu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './option-sidemenu.html',
  styleUrl: './option-sidemenu.css',
})
export class OptionSidemenu {

  IsSidebarOpen = input.required<boolean>();
  IsSidebarOpenChange = output<boolean>();

   readonly navItems: DashboardNavItem[] = [
    { path: 'overview', label: 'Resumen General' },
    { path: 'sales', label: 'Ventas' },
    { path: 'inventory', label: 'Inventario' },
    { path: 'orders', label: 'Pedidos' },
    { path: 'customers', label: 'Clientes' },
    { path: 'reports', label: 'Reportes' },
  ];

  toggleCloseSidebar(): void {
    this.IsSidebarOpenChange.emit(!this.IsSidebarOpen());
  }
}
