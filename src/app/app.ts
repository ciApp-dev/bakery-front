import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreen } from './components/elements/loading-screen/loading-screen';
import { ToastSuccessfullyComponent } from './components/elements/Toasts/toast-successfully/toast-successfully';
import { ToastService } from './service/toast-service';
import { ToastWrong } from "./components/elements/Toasts/toast-wrong/toast-wrong";
import { ConfirmDialogComponent } from './components/elements/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingScreen, ToastSuccessfullyComponent, ToastWrong, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly toastService = inject(ToastService);

  closeToast(id: string): void {
    this.toastService.close(id);
  }
}
