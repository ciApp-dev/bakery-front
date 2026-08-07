import { SucursalTableRow } from "./sucursales-interfaces";

export interface ApiResponse {
    mensaje: string;
    usuario: {
        name: string;
        email: string;
    }
}




export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ToastSuccessfully {
    id: string;
    type: 'success' | 'error';
    message: string;
    durationMs: number;
    closable: boolean;
}

export interface ToastWrong {
    id: string;
    type: 'success' | 'error';
    message: string;
    messageDetails: string;
    durationMs: number;
    closable: boolean;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    user:{
        id: number;
        name: string;
        email: string;
        estado: string;
        roles: string[];
        permissions: string[];
        sucursales: SucursalLoginResponse[];
    }
}

export interface Permission {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    nombre: string;
}

export interface ProductResponse {
    mensaje: string;
}

export interface SucursalLoginResponse {
    id: number;
    name: string;
}

export interface CiudadResponse {
    id: number;
    nombre: string;
}

export interface SucursalResponse {
    messaje: string;
    sucursal: SucursalTableRow;
}

export interface SucursalLoginResponse {
    id: number;
    nombre: string;
}


export interface userResponse {
    id: number;
    name: string;
    email: string;
    estado: string;
    sucursales: SucursalLoginResponse[];
}

export interface genericResponse {
    mensaje: string;
}

export interface RefreshTokenRequest {
    refresh_token?: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
}