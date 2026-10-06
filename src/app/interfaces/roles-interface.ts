import { PermissionItem } from './Permissions-interface';

export interface RoleCategory {
  id: number;
  name: string;
  estado: string;
  descripcion?: string;
};


export interface RoleRequest {
  name: string;
  descripcion?: string;
  permissions?: number[];
}

export interface RolePermissionResponse {
  role: RoleCategory;
  permissions: PermissionItem[];
}
