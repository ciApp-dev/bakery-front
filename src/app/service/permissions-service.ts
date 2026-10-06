import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PermissionItem, PermissionResponse } from '../interfaces/Permissions-interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {

  url = environment.apiUrl;
  header = {
    'Content-Type': 'application/json',
  };

  http = inject(HttpClient);
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

  getPermissions(): Observable<PermissionResponse> {
    return this.http.get<PermissionResponse>(`${this.url}permissions`, { headers: this.header });
  }

}
