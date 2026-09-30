export interface AvalibleResgisters{
    id: number;
    nombre: string;
}

export interface StartActivityRequest {
    caja_id: number;
    usuario_apertura_id: number;
    monto_apertura: number;
    observaciones?: string ;
}

export interface ActivityStartResponse {
  data: ActivityInfo;

}

export interface ActivityInfo {
    id: number;
    caja_id: number;
    nombre_caja: string;
    usuario_apertura_id: number;
    monto_apertura: number;
    observaciones?: string;
    fecha_apertura: string;
    fecha_cierre?: string;
    estado: string;
}

export interface StartedResgister{
    actividad_id: number;
    caja_id: number;
    nombre: string;
    sucursal_id: number;
}


export interface ValidateActivityRequest {
    caja_id: number;
    password: string;
}


export interface ValidateActivityResponse {
    actividad_id: number;
    caja_id:number;
    nombre: string;
    sucursal_id: number;
}

export interface ActivityUserRequest {
    usuario_id: number;
    sucursal_id: number;
}

export interface PaymentMovement {
  caja_actividad_id: number;
  tipo_movimiento: string;
  metodo_pago_id: number;
  monto: number;
  referencia?: string;
  comentarios?: string;
  usuario_id: number;
}


export interface ResumeActivity {
    data: activityData;
    resumen_pagos: resumePayments;
    resumen_ventas: resumeSales;
}

export interface activityData {
    id: number;
    caja_id: number;
    nombre_caja: string;
    sucursal_id: number;
    usuario_apertura_id: number;
    fecha_apertura: string;
    monto_apertura: number;
    observaciones?: string;
    fecha_cierre?: string;
    estado: string;
    monto_cierre?: number;
}

export interface resumePayments {
    metodo_pago_id: number;
    metodo_pago_nombre: string;
    total_ingresos: number;
    total_egresos: number;
    total_neto: number;
}

export interface resumeSales {
    total_ventas: number;
    total_transacciones: number;
    total_canceladas: number;
    total_transacciones_canceladas: number;
}

export interface endActivityResponse {
    message: string;
    data: ActivityInfo;
}