import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonSidemenu } from "../../elements/side-menu/button-sidemenu/button-sidemenu";
import { ButtonSidemenuTrick } from "../../elements/side-menu/button-sidemenu-trick/button-sidemenu-trick";
import { HeaderSidemenu } from "../../elements/side-menu/header-sidemenu/header-sidemenu";
import { FooterSidemenu } from "../../elements/side-menu/footer-sidemenu/footer-sidemenu";
import { OptionSidemenu } from "../../elements/side-menu/option-sidemenu/option-sidemenu";



@Component({
  selector: 'app-dashboard',
  imports: [ RouterOutlet, ButtonSidemenu, ButtonSidemenuTrick, HeaderSidemenu, FooterSidemenu, OptionSidemenu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly isSidebarOpen = signal(false);
 

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
}
