import { Component, inject, signal,output } from '@angular/core';
import { TableForm } from "src/app/components/elements/tables/table-form/table-form";
import { ContentLabelTable } from 'src/app/interfaces/forms';
import { InventarioService } from 'src/app/service/inventario-service';
import { pendingTransfer, pendingTransferResponse } from 'src/app/interfaces/invetario-interface';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';

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
  confirmDialog = inject(ConfirmDialogService);
  toastService = inject(ToastService);

  refreshProductsRequested = output<void>();
  
  contentLabel: ContentLabelTable[] = [
    { id: 1, name: 'Producto', key: 'nombre' },
    { id: 2, name: 'Descripcion', key: 'descripcion' },
    { id: 3, name: 'Cantidad', key: 'cantidad' },
    { id: 4, name: 'Sucursal origen', key: 'sucursal_origen_nombre' },
    { id: 5, name: 'Usuario', key: 'user_nombre' },
    { id: 6, name: 'Fecha', key: 'created_at' },
    { id: 7, name: 'Acciones', key: 'actions' },
  ];
  
  allRegisters = signal<PendingTransferTableRow[]>([]);

  

  constructor() {
    this.getPendintTransfers();
  }

  async onApprove(register: any): Promise<void> {

    
    const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar aprobación',
      message: `¿Está seguro de aprobar el registro seleccionado?`,
      confirmLabel: 'Sí, aprobar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true
    });

    if (!confirm) {
      return;
    }
    this.inventarioService.approvePendingTransfer(register.row.movimiento_id).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Registro aprobado');
        this.refreshProductsRequested.emit();
        this.getPendintTransfers();
      },
      error: (error) => {
        console.error('Error al aprobar el registro:', error);
      }
    });

    

  }

  async onCancel(register: any): Promise<void> {
    

    const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar cancelación',
      message: `¿Está seguro de cancelar el registro seleccionado?`,
      confirmLabel: 'Sí, cancelar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true
    });

    if(!confirm) {
      return;
    }

    this.inventarioService.rejectPendingTransfer(register.row.movimiento_id).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Registro cancelado');
        this.refreshProductsRequested.emit();
        this.getPendintTransfers();
      },
      error: (error) => {
        console.error('Error al cancelar el registro:', error);
      }
    });
  }
  
  showDeleted(): boolean {
    return false; // Cambia esto según tu lógica para mostrar u ocultar acciones
  }


  getPendintTransfers():void {
    const data: pendingTransfer = {
      sucursal_id: Number(localStorage.getItem('idSucursal')), // Cambia esto según tu lógica para obtener el ID de la sucursal
      fecha_inicio: '', 
      fecha_fin: '',
      tipo: 'entrada',
      estado: 'PEN'
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
