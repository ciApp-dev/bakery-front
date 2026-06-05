import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-solo',
  imports: [],
  templateUrl: './input-solo.html',
  styleUrl: './input-solo.css',
})
export class InputSolo {
  inputId = input.required<string>();
  placeHolder = input.required<string>();
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChange.emit(target?.value ?? '');
  }
}
