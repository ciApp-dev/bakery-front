import { Component,output,input } from '@angular/core';

@Component({
  selector: 'app-toast-wrong',
  imports: [],
  templateUrl: './toast-wrong.html',
  styleUrl: './toast-wrong.css',
})
export class ToastWrong {

  readonly message = input.required<string>();
  readonly messageDetails = input.required<string>();

  readonly closed = output<void>();


  closeToast(): void {
    this.closed.emit();
  }
}
