import { Component } from '@angular/core';
import { TableForm } from "src/app/components/elements/tables/table-form/table-form";
import { ContentLabelTable } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-registers',
  imports: [TableForm],
  templateUrl: './registers.html',
  styleUrl: './registers.css',
})
export class Registers {

  
  contentLabel: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'nombre' },
    { id: 2, name: 'Descripción', key: 'descripcion' },
    { id: 3, name: 'Acciones', key: 'actions' },
  ];
  
  allRegisters = [
    { nombre: 'Registro 1', descripcion: 'Descripción del registro 1', icono: 'icono1' },
    { nombre: 'Registro 2', descripcion: 'Descripción del registro 2', icono: 'icono2' },
    { nombre: 'Registro 3', descripcion: 'Descripción del registro 3', icono: 'icono3' },
    // Agrega más registros según sea necesario
  ];


  onApprove(register: any): void {
    console.log('Aprobando registro:', register);
    // Aquí puedes agregar la lógica para aprobar el registro
  }

  onCancel(register: any): void {
    console.log('Cancelando registro:', register);
    // Aquí puedes agregar la lógica para cancelar el registro
  }
  
  showDeleted(): boolean {
    return false; // Cambia esto según tu lógica para mostrar u ocultar acciones
  }
}
