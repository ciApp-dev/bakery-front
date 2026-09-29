import { Component, computed, output, signal } from '@angular/core';
import { InputForm } from 'src/app/components/elements/inputs/input-form/input-form';

type CashDenomination = {
  denomination: number;
  count: number;
};

@Component({
  selector: 'app-modal-deno-cash',
  imports: [InputForm],
  templateUrl: './modal-deno-cash.html',
  styleUrl: './modal-deno-cash.css',
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class ModalDenoCash {
  readonly close = output<void>();
  totalCashValue = output<number>();

  
  readonly denoBillCount = signal<CashDenomination[]>([
    { denomination: 1000, count: 0 },
    { denomination: 500, count: 0 },
    { denomination: 200, count: 0 },
    { denomination: 100, count: 0 },
    { denomination: 50, count: 0 },
    { denomination: 20, count: 0 },
  ]);
  readonly denoCoinCount = signal<CashDenomination[]>([
    { denomination: 20, count: 0 },
    { denomination: 10, count: 0 },
    { denomination: 5, count: 0 },
    { denomination: 2, count: 0 },
    { denomination: 1, count: 0 },
    { denomination: 0.5, count: 0 },
    { denomination: 0.25, count: 0 },
    { denomination: 0.1, count: 0 },
  ]);
  readonly totalCash = computed(() =>
    [...this.denoBillCount(), ...this.denoCoinCount()]
      .reduce((total, denomination) => total + denomination.denomination * denomination.count, 0)
  );

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
      this.totalCashValue.emit(this.totalCash());
    }
  }

  onEscape(): void {
    this.close.emit();
    this.totalCashValue.emit(this.totalCash());
    console.log(this.totalCash());
  }


  onBillChange(denoBill: CashDenomination, value: string | number): void {
    this.updateDenomination(this.denoBillCount, denoBill.denomination, value);
    this.totalCashValue.emit(this.totalCash());
  }

  onCoinChange(denoCoin: CashDenomination, value: string | number): void {
    this.updateDenomination(this.denoCoinCount, denoCoin.denomination, value);
    this.totalCashValue.emit(this.totalCash());
  }

  private updateDenomination(
    denominations: ReturnType<typeof signal<CashDenomination[]>>,
    denomination: number,
    value: string | number,
  ): void {
    const count = Math.max(0, Number(value) || 0);
    denominations.update(current => current.map(item =>
      item.denomination === denomination ? { ...item, count } : item
    ));
  }



}
