export type ProductSendData = {
  nombre: string;
  codigo: string;
  categoria_id: number | null;
  descripcion: string;
  precio: number;
  user_id: number;
};

export type InventoryProductData = {
  sucursal_id: string;
  sucursal:string;
  cantidad: number;
  precio: number | string;
}

export type ProductTableRow = {
  id: number;
  nombre: string;
  categoria: string;
  codigo: string;
  descripcion: string;
  precio: number;
  inventario: InventoryProductData[];
};


export interface ProductSales {
  stock: number;
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  icono: string;
}
