import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input-label',
  imports: [],
  templateUrl: './input-label.html',
  styleUrl: './input-label.css',
})
export class InputLabel {
  label = input.required<string>();
  typeVar = input.required<string>();
}
