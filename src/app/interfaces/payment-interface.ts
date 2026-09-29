export interface PaymentCategory {
  id: number;
  nombre: string;
  requiere_referencia: string;
  
}

export interface PaymentCategoryList{
    id: number;
    name: string;
    referenceRequire: string;
}

export interface PaymentCategoryRequest {
  id?: number;
  nombre: string;
  requiere_referencia: string;
}

export interface PaymentMethod {
  id: number;
  nombre: string;
}

export interface PaymentChashId {
  id: number;
}