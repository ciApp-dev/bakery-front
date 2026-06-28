import { Injectable, signal } from '@angular/core';

export type ConfirmDialogOptions = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  closeOnBackdrop?: boolean;
};

type ConfirmDialogConfig = Required<ConfirmDialogOptions>;

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly defaults: ConfirmDialogConfig = {
    title: 'Confirmar accion',
    message: 'Esta accion no se puede deshacer. Desea continuar?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    destructive: false,
    closeOnBackdrop: true,
  };

  readonly isOpen = signal(false);
  readonly config = signal<ConfirmDialogConfig>(this.defaults);

  private pendingResolver: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmDialogOptions = {}): Promise<boolean> {
    if (this.pendingResolver) {
      this.pendingResolver(false);
      this.pendingResolver = null;
    }

    this.config.set({
      ...this.defaults,
      ...options,
    });
    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.pendingResolver = resolve;
    });
  }

  confirmSelection(): void {
    this.closeWith(true);
  }

  cancelSelection(): void {
    this.closeWith(false);
  }

  private closeWith(result: boolean): void {
    const resolver = this.pendingResolver;
    this.pendingResolver = null;
    this.isOpen.set(false);

    if (resolver) {
      resolver(result);
    }
  }
}
