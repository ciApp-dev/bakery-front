import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { InfoCards } from "../../elements/cards/info-cards/info-cards";

@Component({
  selector: 'app-inventario',
  imports: [InfoCards],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class InventarioComponent {

  cardTextColor = environment.cardTextColor;
}
