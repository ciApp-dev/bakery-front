import { Component,input, output, signal } from '@angular/core';

@Component({
  selector: 'app-input-form',
  imports: [],
  templateUrl: './input-form.html',
  styleUrl: './input-form.css',
})
export class InputForm {
  label = input.required<string>();
  placeholder = input.required<string | null>();
  type = input.required<string>();
  value = input<string | number | null>('');
  valueChange = output<string | number>();
  required = input.required<boolean>();

  errorEstatus = signal(false);

  valueAsText(): string {
    const current = this.value();
    return current === null || current === undefined ? '' : String(current);
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const rawValue = target.value;

    if (this.required() && rawValue.trim() === '') {
      this.errorEstatus.set(true);
    } else {
      this.errorEstatus.set(false);
    }

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

    this.valueChange.emit(rawValue);
    
  }

  


}
