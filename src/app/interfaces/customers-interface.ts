export interface Customer {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rfc: string;
  direccion: string;
  cp: number;
  estado: string;
  ciudad: string;
  
}


export interface CustomerRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rfc: string;
  direccion: string;
  cp: number;
  estado_id: string;
  ciudad_id: string;

}

