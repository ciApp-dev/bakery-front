import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sumary-checkout',
  imports: [],
  templateUrl: './sumary-checkout.html',
  styleUrl: './sumary-checkout.css',
})
export class SumaryCheckout {
  chashAmount = input.required<number>();
  inputAmount = input.required<number>();
  outputAmount = input.required<number>();

  sales = input.required<number>();
  transactions = input.required<number>();
  canceledSales = input.required<number>();
  canceledTransactions = input.required<number>();


}
