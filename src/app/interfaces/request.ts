
export interface CiudadRequest {
    idEstado: number;
}

export interface statusRequest {
    estado: string;
}

export interface abastoSucursalRequest {
    sucursal_id: number;
    producto_id: number;
    cantidad: number;
    motivo: string | null;
    user_id: number;
}