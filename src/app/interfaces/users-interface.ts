export interface UserData{
    id: number;
    name: string;
    password?: string;
    email: string;
    estado: string;
    sucursales: BranchDataUser[];
    roles: UserRole[];
}

export interface BranchDataUser{
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    estado: string;

}

export interface UserRole{
    id: number;
    name: string;
}

export interface UserDataTable extends UserData {
    branch: string;
    roleName: string;
}

export interface UserUpdateRequest {
    name: string;
    email: string;
    role?: string;
    sucursales: number[];
}

export interface UserDataRequest {
    id?: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
    estado?: string;
    sucursales?: number[];
}

