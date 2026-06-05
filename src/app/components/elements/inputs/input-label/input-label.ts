import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-label',
  imports: [],
  templateUrl: './input-label.html',
  styleUrl: './input-label.css',
})
export class InputLabel {
  label = input.required<string>();
  inputId = input.required<string>();
  typeVar = input.required<string>();
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChange.emit(target?.value ?? '');
  }

  
}
