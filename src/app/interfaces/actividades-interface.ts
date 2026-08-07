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
    'id': number;
    'caja_id':number;
    'nombre': string;
    'sucursal_id': number;
}

export interface ActivityUserRequest {
    usuario_id: number;
    sucursal_id: number;
}