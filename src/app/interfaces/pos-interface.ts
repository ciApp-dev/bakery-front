import { ProductSales } from "./products-interfaces";

export interface Sell {
  sucursal_id: number;
  cliente_id: number;
  user_id: number;
  caja_actividad_id: number;
  total: number;
  productos: products[];
  comentarios: string;
  payments: payments[];
}

export interface products{
    producto_id: number;
    cantidad: number;
    precio: number;
    subtotal: number;
    descuento: number;
    total: number;
}
export interface payments{
    metodo_pago_id: number;
    metodo: string;
    monto: number;
    referencia: string;
}



export interface ItemCarrito {
  producto: ProductSales;
  cantidad: number;
  subtotal: number;
}

export interface SaleTab {
  id: number;
  title: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  receivedAmount: number;
  discount: number;
  cart: ItemCarrito[];
  comments: string;
  payments: payments[];
}