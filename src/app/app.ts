import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastSuccessfullyComponent } from './components/elements/Toasts/toast-successfully/toast-successfully';
import { ToastService } from './service/toast-service';
import { ToastWrong } from "./components/elements/Toasts/toast-wrong/toast-wrong";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastSuccessfullyComponent, ToastWrong],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly toastService = inject(ToastService);
  readonly activeSuccessToast = computed(() =>
    this.toastService.toasts().find((toast) => toast.type === 'success')
  );
  protected readonly title = signal('bakery-front');

  readonly activeErrorToast = computed(() =>
    this.toastService.errorToasts().find((toast) => toast.type === 'error')
  );

  closeToast(): void {
    const activeToast = this.activeSuccessToast() || this.activeErrorToast();
    if (!activeToast) {
      return;
    }

    this.toastService.close(activeToast.id);
  }
}
