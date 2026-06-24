export type ProductTableRow = {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string;
  price: number;
};

export type ContentLabelTable = {
    id: number;
    name: string;
  key: string;
};

export type RowActionEvent<T> = {
  id: number | string;
  row: T;
};

export type SelectorOption = {
  id: number;
  nombre: string;
};

export type ProductSendData = {
  nombre: string;
  codigo: string;
  categoria_id: number | null;
  descripcion: string;
  precio: number;
  user_id: number;
};
