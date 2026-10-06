import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { SelectorForm } from 'src/app/components/elements/selectors/selector-form/selector-form';
import type { SelectorOption, ElementsList } from 'src/app/interfaces/forms';
import { RoleCategory, RolePermissionResponse, RoleRequest } from 'src/app/interfaces/roles-interface';
import { RolService } from 'src/app/service/rol-service';
import { PermissionsService } from 'src/app/service/permissions-service';
import { PermissionItem, PermissionResponse } from 'src/app/interfaces/Permissions-interface';
import { ListAssignments } from 'src/app/components/elements/lists/list-assignments/list-assignments';
import { ToastService } from 'src/app/service/toast-service';



@Component({
  selector: 'app-rol-permissions-categories',
  imports: [SelectorForm, ListAssignments],
  templateUrl: './rol-permissions-categories.html',
  styleUrl: './rol-permissions-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolPermissionsCategoriesComponent {

  RolService = inject(RolService);
  PermissionService = inject(PermissionsService);
  toastService = inject(ToastService);

  roles = signal<SelectorOption[]>([]);
  readonly selectedRoleId = signal<number | null>(null);
  selectedRoleName = signal<string | null>(null);
  readonly selectedAvailableId = signal<number | null>(null);
  readonly selectedAssignedId = signal<number | null>(null);

  allPermissions = signal<ElementsList[]>([]);

  availablePermissions = signal<ElementsList[]>([]);
  assignedPermissions = signal<ElementsList[]>([]);

  readonly canAssign = computed(() => this.selectedRoleId() !== null && this.selectedAvailableId() !== null);
  readonly canRemove = computed(() => this.selectedRoleId() !== null && this.selectedAssignedId() !== null);


  constructor() {
    this.getAllRoles();
    this.getAllPermissions();
  }

  onRoleChange(roleId: number): void {
    this.selectedRoleId.set(roleId || null);
    this.selectedRoleName.set(this.roles().find(role => role.id === roleId)?.nombre || null);
    this.selectedAvailableId.set(null);
    this.selectedAssignedId.set(null);
    this.getAssignedPermissions();
  }

  selectAvailable(permissionId: number): void {
    this.selectedAvailableId.set(permissionId);
    this.selectedAssignedId.set(null);
  }

  selectAssigned(permissionId: number): void {
    this.selectedAssignedId.set(permissionId);
    this.selectedAvailableId.set(null);
  }

  getAllRoles(): void {
    const estatus = {estado: 'ACT'};
    this.RolService.getRoles(estatus).subscribe({
      next: (roles:RoleCategory[]) => {

        console.log(roles);
        this.roles.set(roles.map((role) => ({
          id: role.id,
          nombre: role.name,
        })));
      },
      error: (err) => {
        
        console.error(err);
      }
    });

  }

  getAllPermissions(): void {
    this.PermissionService.getPermissions().subscribe({
      next: (response: PermissionItem[] | PermissionResponse | null) => {
        const permissions = Array.isArray(response)
          ? response
          : Array.isArray((response as PermissionResponse | null)?.data)
            ? (response as PermissionResponse).data
            : [];

        this.allPermissions.set(
          permissions.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.descripcion ?? '',
          }))
        );

        this.getAvailablePermissions();
      },
      error: (err) => {
        console.error(err);
        this.allPermissions.set([]);
        this.availablePermissions.set([]);
      }
    });
  }

  getAvailablePermissions(): void {
    const allPermissions = this.allPermissions();
    const assignedIds = new Set(this.assignedPermissions().map((item) => item.id));

    if (this.assignedPermissions().length === 0) {
      console.log('No assigned permissions, all permissions are available.');
      this.availablePermissions.set(allPermissions);
      return;
    }

    this.availablePermissions.set(
      Array.isArray(allPermissions)
        ? allPermissions.filter((item) => !assignedIds.has(item.id))
        : []
    );
  }

  getAssignedPermissions(): void {
    if (this.selectedRoleId() === null) {
      this.assignedPermissions.set([]);
      this.getAvailablePermissions();
      return;
    }

    this.RolService.getPermissionsByRole(this.selectedRoleId()!).subscribe({
      next: (response: RolePermissionResponse) => {
        const permissions = Array.isArray(response?.permissions) ? response.permissions : [];
        this.assignedPermissions.set(
          permissions.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.descripcion ?? '',
          }))
        );
        this.getAvailablePermissions();
      },
      error: (err) => {
        console.error(err);
        this.assignedPermissions.set([]);
        this.getAvailablePermissions();
      }
    });
  }

  assignedPermissionsChange(updatedPermissions: ElementsList[]): void {

    const roleData: RoleRequest = {
      permissions: updatedPermissions.map((item) => item.id),
      name: this.selectedRoleName() ?? ''
    };
    this.RolService.updateRole(this.selectedRoleId()!, roleData).subscribe({
      next: () => {
        
        this.getAssignedPermissions();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
