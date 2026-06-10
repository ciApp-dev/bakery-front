import { Injectable, signal } from '@angular/core';
import { ToastSuccessfully,ToastWrong } from '../interfaces/responses';


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultDurationMs = 3000;
  private readonly activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly _toasts = signal<ToastSuccessfully[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private readonly _errorToasts = signal<ToastWrong[]>([]);
  readonly errorToasts = this._errorToasts.asReadonly();

  showSuccessToast(message: string, durationMs = this.defaultDurationMs): string {
    const toast: ToastSuccessfully = {
      id: this.generateId(),
      type: 'success',
      message,
      durationMs,
      closable: true,
    };

    this._toasts.update((currentToasts) => [...currentToasts, toast]);
    this.scheduleAutoClose(toast);

    return toast.id;
  }

  showErrorToast(message: string, messageDetails: string, durationMs = this.defaultDurationMs): string {
    const toast: ToastWrong = {
      id:this.generateId(),
      type: 'error',
      message,
      messageDetails,
      durationMs,
      closable: true,
    };

    this._errorToasts.update((currentToasts) => [...currentToasts, toast]);
    this.scheduleAutoClose(toast);

    return toast.id;
  }

  close(id: string): void {
    this._toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    this._errorToasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));

    const activeTimer = this.activeTimers.get(id);
    if (activeTimer) {
      clearTimeout(activeTimer);
      this.activeTimers.delete(id);
    }
  }

  clearAll(): void {
    for (const timer of this.activeTimers.values()) {
      clearTimeout(timer);
    }

    this.activeTimers.clear();
    this._toasts.set([]);
    this._errorToasts.set([]);
  }

  private scheduleAutoClose(toast: ToastSuccessfully | ToastWrong): void {
    if (toast.durationMs <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      this.close(toast.id);
    }, toast.durationMs);

    this.activeTimers.set(toast.id, timer);
  }

  private generateId(): string {
    if ('crypto' in globalThis && 'randomUUID' in globalThis.crypto) {
      return globalThis.crypto.randomUUID();
    }

    return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
