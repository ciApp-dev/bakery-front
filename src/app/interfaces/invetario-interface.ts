export interface productoInterface {
    id: number;
    nombre: string;
    categoria_id: number;
    descripcion?: string;
    inventario: inventarioInterface[];
}


export interface inventarioInterface {
    sucursal_id: number;
    sucursal: string;
    precio: number;
    cantidad: number;
}