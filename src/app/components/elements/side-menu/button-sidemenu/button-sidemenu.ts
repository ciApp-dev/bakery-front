import { Component,output,input } from '@angular/core';

@Component({
  selector: 'app-button-sidemenu',
  imports: [],
  templateUrl: './button-sidemenu.html',
  styleUrl: './button-sidemenu.css',
})
export class ButtonSidemenu {

  showSidebar = input.required<boolean>();
  isSidebarOpenChange = output<boolean>();



  toggleCloseSidebar(): void {
    this.isSidebarOpenChange.emit(!this.showSidebar());    
  }
}
