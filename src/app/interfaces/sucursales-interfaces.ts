

export type SucursalTableRow = {
    id: number;
    nombre: string;
    direccion: string;
    cp: number;
    ciudad: string;
    estado: string;
    status: string;
    telefonos: string[];
    produccion: string;

}

export type SucursalSendData = {
    nombre: string;
    direccion: string;
    cp: number;
    ciudad_id: number | null;
    estado_id: number | null;
    telefonos: string;
    produccion: string | 'NO';
}
