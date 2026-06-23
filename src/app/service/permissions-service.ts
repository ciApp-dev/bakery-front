import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly _permissions = signal<string[]>([]);

  readonly permissions = this._permissions.asReadonly();
  readonly permissionsCount = computed(() => this._permissions().length);

  setPermissions(permissions: readonly string[]): void {
    this._permissions.set([...new Set(permissions)]);
  }

  clearPermissions(): void {
    this._permissions.set([]);
  }

  has(permission: string): boolean {
    return this._permissions().includes(permission);
  }

  hasAny(permissions: readonly string[]): boolean {
    return permissions.some((permission) => this.has(permission));
  }

  hasAll(permissions: readonly string[]): boolean {
    return permissions.every((permission) => this.has(permission));
  }

}
