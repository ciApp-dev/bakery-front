import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonSidemenu } from "../../elements/side-menu/button-sidemenu/button-sidemenu";
import { ButtonSidemenuTrick } from "../../elements/side-menu/button-sidemenu-trick/button-sidemenu-trick";
import { HeaderSidemenu } from "../../elements/side-menu/header-sidemenu/header-sidemenu";
import { FooterSidemenu } from "../../elements/side-menu/footer-sidemenu/footer-sidemenu";
import { OptionSidemenu } from "../../elements/side-menu/option-sidemenu/option-sidemenu";
import { DropdownForm } from "../../elements/buttons/dropdown-form/dropdown-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { SucursalesService } from 'src/app/service/sucursales-service';
import { ButtonSecundaryForm } from "../../elements/buttons/button-secundary-form/button-secundary-form";
import { ActivityStartComponent } from '../../elements/activity-start/activity-start';

type ActivityStartPayload = {
  activity: string;
  reference: string;
};


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, ButtonSidemenu, ButtonSidemenuTrick, HeaderSidemenu, FooterSidemenu, OptionSidemenu, DropdownForm, ButtonSecundaryForm, ActivityStartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  readonly isSidebarOpen = signal(false);
  readonly isActivityStartOpen = signal(false);
  sucursales = signal<SelectorOption[]>([]);
  readonly activityOptions = [
    { value: 'inventario', label: 'Inventario' },
    { value: 'venta', label: 'Venta' },
    { value: 'produccion', label: 'Produccion' },
  ];

  router = inject(Router);



  sucursalesService = inject(SucursalesService);
  nameSucursal = signal<string>('');

  ngOnInit(): void {
    this.getSucursales();
    this.nameSucursal.set(localStorage.getItem('nameSucursal') || 'Seleccione una sucursal');
  }


  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  onNavItemClick(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {

      this.closeSidebar();
    }

  }

  getSucursales(): void {
    const userId = Number(localStorage.getItem('id_user'));

    if (!Number.isFinite(userId) || userId <= 0) {
      console.error('No se pudo obtener id_user valido desde localStorage');
      this.sucursales.set([]);
      return;
    }

    this.sucursalesService.getSucursalesUser(userId).subscribe({
      next: (response) => {
        const options: SelectorOption[] = response.sucursales.map((sucursal) => ({
          id: sucursal.id,
          nombre: sucursal.nombre
        }));
        this.sucursales.set(options);
        console.log('Sucursales obtenidas:', this.sucursales());
      },
      error: (error) => {
        console.error('Error al obtener las sucursales:', error);
      }
    });
  }

  onSucursalChange(selectedId: string | number): void {
    const selectedSucursal = this.sucursales().find(sucursal => sucursal.id === Number(selectedId));
    if (selectedSucursal) {
      console.log('Sucursal seleccionada:', selectedSucursal.nombre);
      localStorage.setItem('nameSucursal', selectedSucursal.nombre);
      localStorage.setItem('idSucursal', selectedSucursal.id.toString());
      this.nameSucursal.set(selectedSucursal.nombre);
      this.router.navigate(['/dashboard/overview']);
    } else {
      console.error('Sucursal no encontrada para el id:', selectedId);
    }

  }


  showModal(): void {
    this.isActivityStartOpen.set(true);
  }

  onActivityCancel(): void {
    this.isActivityStartOpen.set(false);
  }

  onActivityStart(payload: ActivityStartPayload): void {
    
    this.isActivityStartOpen.set(false);
  }


}
