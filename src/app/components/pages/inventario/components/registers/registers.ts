import { Component, inject, signal } from '@angular/core';
import { TableForm } from "src/app/components/elements/tables/table-form/table-form";
import { ContentLabelTable } from 'src/app/interfaces/forms';
import { InventarioService } from 'src/app/service/inventario-service';
import { pendingTransfer, pendingTransferResponse } from 'src/app/interfaces/invetario-interface';

type PendingTransferTableRow = pendingTransferResponse & {
  nombre: string;
  descripcion: string;
  actions: string;
};

@Component({
  selector: 'app-registers',
  imports: [TableForm],
  templateUrl: './registers.html',
  styleUrl: './registers.css',
})
export class Registers {

  inventarioService = inject(InventarioService);
  
  contentLabel: ContentLabelTable[] = [
    { id: 1, name: 'Producto', key: 'nombre' },
    { id: 2, name: 'Descripcion', key: 'descripcion' },
    { id: 3, name: 'Cantidad', key: 'cantidad' },
    { id: 4, name: 'Sucursal origen', key: 'sucursal_origen_nombre' },
    { id: 5, name: 'Fecha', key: 'created_at' },
    { id: 6, name: 'Acciones', key: 'actions' },
  ];
  
  allRegisters = signal<PendingTransferTableRow[]>([]);
/*allRegisters = [
    {
      id: 1,
      name: 'Producto 1',
      descripcion: 'Descripción del producto 1',
      actions: 'Aprobar | Cancelar'
    }
];*/

  constructor() {
    this.getPendintTransfers();
  }

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


  getPendintTransfers():void {
    const data: pendingTransfer = {
      sucursal_id: Number(localStorage.getItem('idSucursal')), // Cambia esto según tu lógica para obtener el ID de la sucursal
      fecha_inicio: '2026-07-10', // Cambia esto según tu lógica para obtener la fecha de inicio
      fecha_fin: '2026-07-23' // Cambia esto según tu lógica para obtener la fecha de fin
    };

    this.inventarioService.getPendingTransfers(data).subscribe({
      next: (response) => {
      console.log('Registros pendientes obtenidos:', response);

      this.allRegisters.set(response.map((item) => ({
        ...item,
        nombre: item.producto_nombre,
        descripcion: item.motivo,
        created_at: item.created_at.split('T')[0] || item.created_at,
        actions: 'Aprobar | Cancelar'
      })));
      },
      error: (error) => {
        console.error('Error al obtener los registros pendientes:', error);
      }
    });
  }
}
