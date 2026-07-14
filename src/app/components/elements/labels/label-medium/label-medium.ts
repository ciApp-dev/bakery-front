import { Component,input } from '@angular/core';

@Component({
  selector: 'app-label-medium',
  imports: [],
  templateUrl: './label-medium.html',
  styleUrl: './label-medium.css',
})
export class LabelMedium {
  label = input.required<string>();
}
