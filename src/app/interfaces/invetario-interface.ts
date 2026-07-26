export interface productoInterface {
    id: number;
    nombre: string;
    categoria_id: number;
    categoria: string;
    descripcion?: string;
    inventario: inventarioInterface[];
}


export interface inventarioInterface {
    sucursal_id: number;
    sucursal: string;
    precio: number;
    cantidad: number;
}

export interface transferenciaInterface {
    sucursal_origen_id: number;
    sucursal_destino_id: number;
    producto_id: number;
    cantidad: number;
    user_id: number;
    motivo?: string;
}

export interface stockListInterface {
    sucursal_id: number;
    nombre: string;
    categoria: string;
    sucursal: string;
    precio: number;
    cantidad: number;
    descripcion?: string;
}

export interface pendingTransfer {
    sucursal_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    tipo: string;
    estado: string;
}

export interface pendingTransferResponse {
    id: number;
    movimiento_id: number;
    sucursal_id: number;
    producto_id: number;
    producto_nombre: string;
    user_id: number;
    user_nombre: string;
    tipo: string;
    cantidad: number;
    motivo: string;
    sucursal_origen_id: number;
    sucursal_origen_nombre: string;
    created_at: string;
}
