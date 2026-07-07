import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonSidemenu } from "../../elements/side-menu/button-sidemenu/button-sidemenu";
import { ButtonSidemenuTrick } from "../../elements/side-menu/button-sidemenu-trick/button-sidemenu-trick";
import { HeaderSidemenu } from "../../elements/side-menu/header-sidemenu/header-sidemenu";
import { FooterSidemenu } from "../../elements/side-menu/footer-sidemenu/footer-sidemenu";
import { OptionSidemenu } from "../../elements/side-menu/option-sidemenu/option-sidemenu";
import { DropdownForm } from "../../elements/buttons/dropdown-form/dropdown-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { SucursalesService } from 'src/app/service/sucursales-service';
import { SelectorForm } from "../../elements/selectors/selector-form/selector-form";



@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, ButtonSidemenu, ButtonSidemenuTrick, HeaderSidemenu, FooterSidemenu, OptionSidemenu, DropdownForm, SelectorForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  readonly isSidebarOpen = signal(false);
  sucursales = signal<SelectorOption[]>([]);

  sucursalesService = inject(SucursalesService);

  ngOnInit(): void {
    this.getSucursales();
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

}
