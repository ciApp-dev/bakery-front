import { Component,input, output, signal } from '@angular/core';
import { PassInputsButton } from "../../pass-inputs-button/pass-inputs-button";

@Component({
  selector: 'app-input-form',
  imports: [PassInputsButton],
  templateUrl: './input-form.html',
  styleUrl: './input-form.css',
})
export class InputForm {
  label = input.required<string>();
  placeholder = input.required<string | null>();
  type = input.required<string>();
  value = input<string | number | null>('');
  valueChange = output<string | number>();
  disabled = input<boolean>(false);

  showPassword = signal<boolean>(false);


  valueAsText(): string {
    const current = this.value();
    return current === null || current === undefined ? '' : String(current);
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const rawValue = target.value;


    if (this.type() === 'number') {
      const sanitized = rawValue.replace(/\D+/g, '');

      if (sanitized !== rawValue) {
        target.value = sanitized;
      }

      this.valueChange.emit(sanitized === '' ? '' : Number(sanitized));
      return;
    }

    if (this.type() === 'decimal') {
      let sanitized = rawValue.replace(',', '.').replace(/[^\d.]/g, '');
      const firstDot = sanitized.indexOf('.');

      if (firstDot !== -1) {
        sanitized =
          sanitized.slice(0, firstDot + 1) +
          sanitized.slice(firstDot + 1).replace(/\./g, '');
      }

      if (sanitized !== rawValue) {
        target.value = sanitized;
      }

      this.valueChange.emit(sanitized);
      return;
    }

    if (this.type() === 'phone') {
      const digits = rawValue.replace(/\D+/g, '').slice(0, 10);
      const masked = this.formatPhoneValue(digits);

      if (masked !== rawValue) {
        target.value = masked;
      }

      this.valueChange.emit(masked);
      return;
    }

    this.valueChange.emit(rawValue);
    

    if(this.type() === 'password'){
      this.valueChange.emit(rawValue);
    }
  }

  private formatPhoneValue(digits: string): string {
    if (digits.length <= 3) {
      return digits;
    }

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }

    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  


}
