export interface resumeMovements {
  data: resumeMovementsData[];
}

export interface resumeMovementsData {
  id: number;
  caja_actividad_id: number;
  metodo_pago_id: number;
  monto: number;
  referencia?: string;
  comentarios?: string;
  usuario_id: number;
  venta_id: number;
  created_at: string;
  metodo_pago:  paymentDetails;
  usuario:  userDetails;
}

export interface paymentDetails {
  id: number;
  nombre: string;
}

export interface userDetails {
  id: number;
  name: string;
}

export interface CheckoutRegisterRow {
  id: number;
  tipo: string;
  monto: string;
  metodo: string;
  referencia: string;
  comentario: string;
  usuario: string;
  fecha: string;
  hora: string;
  estado: string;
};

export interface DenoBillCount {
  denomination: number;
  count: number;
}

export interface endActivityRequest {
  usuario_cierre_id: number;
  monto_estimado: number;
  monto_cierre: number;
  observaciones?: string;

}