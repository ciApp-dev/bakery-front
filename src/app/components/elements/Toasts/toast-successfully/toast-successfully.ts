import { Component, input, output } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-toast-successfully',
  imports: [],
  templateUrl: './toast-successfully.html',
  styleUrl: './toast-successfully.css',
})
export class ToastSuccessfullyComponent {
  readonly message = input('Usuario guardado correctamente.');
  readonly closed = output<void>();

  readonly darkModeToast = environment.darkModeToast;

  closeToast(): void {
    this.closed.emit();
  }
}
