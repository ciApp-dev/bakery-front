import { Component, signal, input, output } from '@angular/core';
import { PassInputsButton } from "../../pass-inputs-button/pass-inputs-button";

@Component({
  selector: 'app-input-pass-solo',
  imports: [PassInputsButton],
  templateUrl: './input-pass-solo.html',
  styleUrl: './input-pass-solo.css',
})
export class InputPassSolo {

  showPassword = signal<boolean>(false);

  inputId = input.required<string>();
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChange.emit(target?.value ?? '');
  }
}
