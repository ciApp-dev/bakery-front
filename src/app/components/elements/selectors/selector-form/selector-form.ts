import { Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { SelectorOption } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-selector-form',
  imports: [],
  templateUrl: './selector-form.html',
  styleUrl: './selector-form.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeOptions()'
  }
})
export class SelectorForm {
  private hostElement = inject(ElementRef<HTMLElement>);
  label = input.required<string>();
  placeholder = input.required<string>();
  options = input.required<SelectorOption[]>();
  value = input<number | null>(null);
  valueChange = output<number>();
  query = signal('');
  isOpen = signal(false);
  filteredOptions = computed(() => {
    const term = this.query().trim().toLowerCase();

    if (!term) {
      return this.options();
    }

    return this.options().filter((option) => option.nombre.toLowerCase().includes(term));
  });
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const selectedValue = this.value();

      if (selectedValue === null || selectedValue === 0) {
        this.query.set('');
        return;
      }

      const selected = this.options().find((option) => Number(option.id) === Number(selectedValue));
      if (selected) {
        this.query.set(selected.nombre);
      }
    });
  }

  onQueryInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
    this.isOpen.set(true);
  }

  onInputFocus(): void {
    this.clearCloseTimer();
    this.isOpen.set(true);
  }

  onInputBlur(): void {
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.isOpen.set(false);
    }, 120);
  }

  selectOption(option: SelectorOption): void {
    this.clearCloseTimer();
    this.query.set(option.nombre);
    this.valueChange.emit(Number(option.id));
    this.isOpen.set(false);
  }

  clearQuery(): void {
    this.clearCloseTimer();
    this.query.set('');
    this.valueChange.emit(0);
    this.isOpen.set(true);
  }

  closeOptions(): void {
    this.clearCloseTimer();
    this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && !this.hostElement.nativeElement.contains(target)) {
      this.closeOptions();
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
