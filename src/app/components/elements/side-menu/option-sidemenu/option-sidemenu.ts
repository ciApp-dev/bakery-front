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
    { path: 'administracion', label: 'Administración' },
    { path: 'clientes', label: 'Clientes'},
    { path: 'productos', label: 'Productos'},
    { path: 'ventas', label: 'Ventas'},
    { path: 'inventario', label: 'Inventario'},
    { path: 'reportes', label: 'Reportes'},
    { path: 'configuracion', label: 'Configuración'},
    { path: 'ayuda', label: 'Ayuda'}

  ];

  toggleCloseSidebar(): void {
    this.IsSidebarOpenChange.emit(!this.IsSidebarOpen());
  }
}
