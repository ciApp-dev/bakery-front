export type ProductSendData = {
  nombre: string;
  codigo: string;
  categoria_id: number | null;
  descripcion: string;
  precio: number;
  user_id: number;
};

export type InventoryProductData = {
  tienda: string;
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