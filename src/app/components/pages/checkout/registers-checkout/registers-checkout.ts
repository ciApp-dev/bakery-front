import { Component, input } from '@angular/core';
import { TableStatus } from "src/app/components/elements/tables/table-status/table-status";
import { ContentLabelTable } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-registers-checkout',
  imports: [TableStatus],
  templateUrl: './registers-checkout.html',
  styleUrl: './registers-checkout.css',
})
export class RegistersCheckout {
  content = input.required<unknown[]>();
  contentLabel = input.required<ContentLabelTable[]>();
}
