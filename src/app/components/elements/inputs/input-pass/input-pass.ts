import { Component, signal, input, output } from '@angular/core';
import { PassInputsButton } from "../../pass-inputs-button/pass-inputs-button";

@Component({
  selector: 'app-input-pass',
  imports: [PassInputsButton],
  templateUrl: './input-pass.html',
  styleUrl: './input-pass.css',
})
export class InputPass {

  showPassword = signal<boolean>(false);

  label =  input.required<string>();
  inputId = input.required<string>();
  value = input<string>('');
  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChange.emit(target?.value ?? '');
  }
}
