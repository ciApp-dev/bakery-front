import { Component,input } from '@angular/core';

@Component({
  selector: 'app-label-small',
  imports: [],
  templateUrl: './label-small.html',
  styleUrl: './label-small.css',
})
export class LabelSmall {
  label = input.required<string>();
}
