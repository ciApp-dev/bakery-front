import { Component,input,output } from '@angular/core';

@Component({
  selector: 'app-button-sidemenu-trick',
  imports: [],
  templateUrl: './button-sidemenu-trick.html',
  styleUrl: './button-sidemenu-trick.css',
})
export class ButtonSidemenuTrick {
  showSidebar = input.required<boolean>();
  isSidebarOpenChange = output<boolean>();

  toggleCloseSidebar(): void {
    this.isSidebarOpenChange.emit(!this.showSidebar());
  }
}
