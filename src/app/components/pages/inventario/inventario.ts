import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { environment } from '@environments/environment';
import { InfoCards } from "../../elements/cards/info-cards/info-cards";
import { EntranceRegister } from "./components/entrance-register/entrance-register";
import { RegisterOut } from './components/register-out/register-out';

type InventarioTab = 'entradas' | 'salidas';

@Component({
  selector: 'app-inventario',
  imports: [NgClass, InfoCards, EntranceRegister, RegisterOut],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class InventarioComponent {
  readonly tabs: Array<{ id: InventarioTab; label: string }> = [
    { id: 'entradas', label: 'Entradas' },
    { id: 'salidas', label: 'Salidas' },
  ];

  readonly activeTab = signal<InventarioTab>('entradas');

  cardTextColor = environment.cardTextColor;
  cardTextBadColor = environment.cardTextColorBad;
  cardTextWarningColor = environment.cardTextColorWarning;

  selectTab(tab: InventarioTab): void {
    this.activeTab.set(tab);
  }

  isActiveTab(tab: InventarioTab): boolean {
    return this.activeTab() === tab;
  }
}
