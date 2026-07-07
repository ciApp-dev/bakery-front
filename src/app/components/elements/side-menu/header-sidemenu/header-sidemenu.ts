import { Component,signal,input } from '@angular/core';

@Component({
  selector: 'app-header-sidemenu',
  imports: [],
  templateUrl: './header-sidemenu.html',
  styleUrl: './header-sidemenu.css',
})
export class HeaderSidemenu {

  name = signal<string | null>(null);

  nameSucursal = input.required<string>();

  constructor() {
    const rawName = localStorage.getItem('nameSucursal');

    if (!rawName) {
      this.name.set(null);
      return;
    }

    const normalized = rawName.replace(/^"|"$/g, '');
    this.name.set(normalized);
  }
}
