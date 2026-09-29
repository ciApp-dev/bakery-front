import { Component, inject, signal } from '@angular/core';
import { ToastService } from 'src/app/service/toast-service';
import { PaymentsService } from 'src/app/service/payments-service';
import { ActivitiesService } from 'src/app/service/activities-service';
import { InRegisterComponent } from "./in-register/in-register";
import { OutRegister } from "./out-register/out-register";
import { EndRegister } from "./end-register/end-register";
import { RegistersCheckout } from "./registers-checkout/registers-checkout";
import { SumaryCheckout } from "./sumary-checkout/sumary-checkout";
import { resumePayments } from 'src/app/interfaces/actividades-interface';
import { CheckoutService } from 'src/app/service/checkout-service';
import { resumeMovements } from 'src/app/interfaces/checkout-interface';
import { ContentLabelTable } from 'src/app/interfaces/forms';
import { CheckoutRegisterRow } from 'src/app/interfaces/checkout-interface';




@Component({
  selector: 'app-checkout',
  imports: [InRegisterComponent, OutRegister, EndRegister, RegistersCheckout, SumaryCheckout],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  paymentsService = inject(PaymentsService);
  activitiesService = inject(ActivitiesService);
  toastService = inject(ToastService);
  checkoutService = inject(CheckoutService);  


  cashId = signal<number | null>(null);
  cashAmount = signal<number>(0);
  inputAmount = signal<number>(0);
  outputAmount = signal<number>(0);

  sales = signal<number>(0);
  transactions = signal<number>(0);
  canceledSales = signal<number>(0);
  canceledTransactions = signal<number>(0);

  allRegisters = signal<CheckoutRegisterRow[]>([]);

  labelTableRegisters: ContentLabelTable[] = [
    { id: 1, name: 'Tipo', key: 'tipo' },
    { id: 2, name: 'Monto', key: 'monto' },
    { id: 3, name: 'Metodo', key: 'metodo' },
    { id: 4, name: 'Referencia', key: 'referencia' },
    { id: 5, name: 'Comentario', key: 'comentario' },
    { id: 6, name: 'Usuario', key: 'usuario' },
    { id: 7, name: 'Fecha', key: 'fecha' },
    { id: 8, name: 'Hora', key: 'hora' },
    { id: 9, name: 'Estado', key: 'estado' }
  ]

  constructor() {
    this.getCashId();
    this.geRegisters();
  }

  refreshRegisters(refresh: boolean) {
    if (refresh) {
      
        this.getCashAmount(this.cashId() ?? 0);
        this.geRegisters();

    }
  }

  getCashId(): void {
    this.paymentsService.getPaymentChashId().subscribe({
      next: (paymentCashId) => {
        this.cashId.set(paymentCashId.id);
        this.getCashAmount(paymentCashId.id);
        console.log('Cash ID loaded:', paymentCashId.id);
      },
      error: (error) => {
        console.error('Error loading cash ID:', error);
      },
    });
  }

  getCashAmount(cashPaymentId: number): void {
    const cajaActividadId = Number(localStorage.getItem('actividad_id'));
    if (!Number.isFinite(cajaActividadId) || cajaActividadId <= 0) {
      this.cashAmount.set(0);
      return;
    }

    this.activitiesService.getResumeActivity(cajaActividadId).subscribe({
      next: (resume) => {
        const summaryRows: resumePayments[] = Array.isArray(resume.resumen_pagos)
          ? resume.resumen_pagos
          : [resume.resumen_pagos];
        const cashPayment = summaryRows.find((payment) => payment.metodo_pago_id === cashPaymentId);

        this.inputAmount.set(cashPayment ? cashPayment.total_ingresos : 0);
        this.outputAmount.set(cashPayment ? cashPayment.total_egresos : 0);
        this.cashAmount.set(cashPayment ? cashPayment.total_neto : 0);

        this.sales.set(resume.resumen_ventas?.total_ventas ?? 0);
        this.transactions.set(resume.resumen_ventas?.total_transacciones ?? 0);
        this.canceledSales.set(resume.resumen_ventas?.total_canceladas ?? 0);
        this.canceledTransactions.set(resume.resumen_ventas?.total_transacciones_canceladas ?? 0);
        
      },
      error: (error) => {
        this.toastService.showErrorToast('Error loading cash amount', error);
      },
    });
  }


  geRegisters(){
    const cajaActividadId = Number(localStorage.getItem('actividad_id'));
    if (!Number.isFinite(cajaActividadId) || cajaActividadId <= 0) {
      this.allRegisters.set([]);
      return;
    }

    this.checkoutService.getMovements(cajaActividadId).subscribe({
      next: (movements: resumeMovements) => {
        const rows: CheckoutRegisterRow[] = (movements.data ?? []).map((movement) => {
          const movementType = (movement as { tipo_movimiento?: string }).tipo_movimiento;
          const estadoValue = (movement as { estado?: string }).estado;
          

         

          return {
            id: movement.id,
            tipo: movementType === 'ING' ? 'Entrada' : movementType === 'EGR' ? 'Salida' : 'Movimiento',
            monto: '$ '+ Number(movement.monto).toFixed(2),
            metodo: movement.metodo_pago?.nombre ?? String(movement.metodo_pago_id),
            referencia: movement.referencia ?? '-',
            comentario: movement.comentarios ?? '-',
            usuario: movement.usuario?.name ?? String(movement.usuario_id),
            fecha: movement.created_at.split('T')[0],
            hora: movement.created_at.split('T')[1].split('.')[0],
            estado: estadoValue ?? 'ACT',
          };
        });

        this.allRegisters.set(rows);
      },
      error: (error) => {
        this.toastService.showErrorToast('Error loading movements', error);
      },
    });
  }
}
