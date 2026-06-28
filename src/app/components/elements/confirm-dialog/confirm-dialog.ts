import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ConfirmDialogComponent {
  readonly confirmDialogService = inject(ConfirmDialogService);

  onConfirm(): void {
    this.confirmDialogService.confirmSelection();
  }

  onCancel(): void {
    this.confirmDialogService.cancelSelection();
  }

  onBackdropClick(): void {
    if (!this.confirmDialogService.config().closeOnBackdrop) {
      return;
    }

    this.onCancel();
  }

  onEscape(): void {
    if (!this.confirmDialogService.isOpen()) {
      return;
    }

    this.onCancel();
  }
}
