import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label-form',
  imports: [],
  templateUrl: './label-form.html',
  styleUrl: './label-form.css',
})
export class LabelForm {
  label = input.required<string>();
}
