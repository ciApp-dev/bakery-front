export interface RoleCategory {
  id: number;
  name: string;
  estado: string;
  descripcion?: string;
};


export interface RoleRequest {
  name: string;
  descripcion?: string;
}
