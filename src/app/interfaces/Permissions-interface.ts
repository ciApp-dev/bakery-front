export interface PermissionItem {
  id: number;
  name: string;
  descripcion: string;
};

export interface PermissionResponse{
    data: PermissionItem[];
}