export interface ReportTabs {
 path: string;
 label: string;
}

export interface SalesReportRequest {
    sucursal_id?: number;
    cliente_id?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    user_id?: number;
}

export interface SaleReportItem {
    id: number;
    created_at: string;
    total: number;
    recibido?: number;
    cambio?: number;
    comentarios?: string | null;
    estado?: string;
    cliente?: { nombre: string; apellido?: string } | null;
    sucursal?: { nombre: string } | null;
    user?: { name: string } | null;
}

export interface SalesReportResponse {
    mensaje: string;
    total: number;
    data: SaleReportItem[];
    pagina_actual: number;
    por_pagina: number;
}

export interface SalesReportRow {
    id: number;
    sucursal: string;
    vendedor: string;
    cliente: string;
    total: number;
    pago: number;
    cambio: number;
    comentarios: string;
    fecha: string;
    estado: string;
}