import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _pendingRequests = signal(0);

  readonly isLoading = computed(() => this._pendingRequests() > 0);

  show(): void {
    this._pendingRequests.update((count) => count + 1);
  }

  hide(): void {
    this._pendingRequests.update((count) => Math.max(0, count - 1));
  }

  reset(): void {
    this._pendingRequests.set(0);
  }

}
