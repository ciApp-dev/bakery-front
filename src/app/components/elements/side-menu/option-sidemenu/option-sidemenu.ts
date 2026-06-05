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
    { path: 'sucursales', label: 'Sucursales' },

  ];

  toggleCloseSidebar(): void {
    this.IsSidebarOpenChange.emit(!this.IsSidebarOpen());
  }
}
