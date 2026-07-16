import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-search-form',
  imports: [],
  templateUrl: './input-search-form.html',
  styleUrl: './input-search-form.css',
})
export class InputSearchForm {
  value = input('');
  placeholder = input.required<string>();
  valueChange = output<string>();

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const nextValue = target.value;
    this.valueChange.emit(nextValue);
  }
}
