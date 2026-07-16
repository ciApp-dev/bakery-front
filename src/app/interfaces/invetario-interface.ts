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