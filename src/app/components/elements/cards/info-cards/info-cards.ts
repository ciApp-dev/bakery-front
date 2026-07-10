import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-cards',
  imports: [],
  templateUrl: './info-cards.html',
  styleUrl: './info-cards.css',
})
export class InfoCards {

  labelTitle = input.required<string>();
  labelValue = input.required<string>();
  textColor = input.required<string>();
}
