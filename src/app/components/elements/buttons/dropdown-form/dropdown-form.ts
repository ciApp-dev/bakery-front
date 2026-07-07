import { Component, HostListener, input, output, signal } from '@angular/core';
import { SelectorOption } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-dropdown-form',
  imports: [],
  templateUrl: './dropdown-form.html',
  styleUrl: './dropdown-form.css',
})
export class DropdownForm {
  label = input.required<string>();

  options = input.required<SelectorOption[]>();

  valueChange = output<number>();
  isOpen = signal(false);

  selectedOption(option: SelectorOption):void{
    this.valueChange.emit(Number(option.id));
    this.isOpen.set(false);
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((value) => !value);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdown();
  }
}
