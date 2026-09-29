import { Component, inject, input, output, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from 'src/app/service/checkout-service';
import { ToastService } from 'src/app/service/toast-service';
import { ActivitiesService } from 'src/app/service/activities-service';
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { ButtonMainForm } from "src/app/components/elements/buttons/button-main-form/button-main-form";
import { PaymentsService } from 'src/app/service/payments-service';
import { PaymentMovement } from 'src/app/interfaces/actividades-interface';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';

@Component({
  selector: 'app-in-register',
  imports: [InputForm, ButtonMainForm],
  templateUrl: './in-register.html',
  styleUrl: './in-register.css',
})
export class InRegisterComponent {
  paymentsService = inject(PaymentsService);
  activitiesService = inject(ActivitiesService);
  checkoutService = inject(CheckoutService);

  toastService = inject(ToastService);
  confirmDialog = inject(ConfirmDialogService);

  cashId = input.required<number>();

  refresh = output<boolean>();

  amount = signal<number>(0);
  concept = signal<string>('');
  comment = signal<string>('');

  form = new FormGroup({
    amount: new FormControl(0,[Validators.required,Validators.min(0)]),
    concept: new FormControl('', Validators.required),
    comment: new FormControl('', )
  });

  onAmountChange(value: number| string) {
    const parsedValue = typeof value === 'string'
      ? (value.trim() === '' ? 0 : Number(value))
      : value;
    this.amount.set(parsedValue);
    this.form.controls.amount.setValue(parsedValue);
    this.form.controls.amount.markAsTouched();
  }

  onConceptChange(value: number | string) {
    const parsedValue = typeof value === 'string' ? value : value.toString();
    this.concept.set(parsedValue);
    this.form.controls.concept.setValue(parsedValue);
    this.form.controls.concept.markAsTouched();
  }

  onCommentChange(value: number | string) {
    const parsedValue = typeof value === 'string' ? value : value.toString();
    this.comment.set(parsedValue);
    this.form.controls.comment.setValue(parsedValue);
    this.form.controls.comment.markAsTouched();
  }

  async onSendMovement() {
    const confirmDialogResult = await this.confirmDialog.confirm({ title: 'Confirmar entrada de efectivo', message: '¿Está seguro de realizar el movimiento?',
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      destructive: false,
      closeOnBackdrop:false
     });
    if (!confirmDialogResult) {
      return;
    }


    const movement: PaymentMovement = {
      caja_actividad_id: localStorage.getItem('actividad_id') ? parseInt(localStorage.getItem('actividad_id')!) : 0,
      tipo_movimiento: 'ING',
      metodo_pago_id: this.cashId(),
      monto: this.amount(),
      referencia: this.concept(),
      comentarios: this.comment(),
      usuario_id: localStorage.getItem('id_user') ? parseInt(localStorage.getItem('id_user')!) : 0
    };
    

    this.checkoutService.sendMovement(movement).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast('Movimiento enviado con éxito');
        this.clearForm();
        this.refresh.emit(true);
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al enviar el movimiento', error);
      }
    });

  }

  clearForm() {
    this.form.reset({
      amount: 0,
      concept: '',
      comment: '',
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.amount.set(0);
    this.concept.set('');
    this.comment.set('');
  }
  


}
