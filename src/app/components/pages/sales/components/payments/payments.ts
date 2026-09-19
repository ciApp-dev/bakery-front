import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { environment } from '@environments/environment';
import { statusRequest } from 'src/app/interfaces/request';
import { PaymentsService } from 'src/app/service/payments-service';
import { inject } from '@angular/core';
import { PaymentCategory } from 'src/app/interfaces/payment-interface';
import { payments } from 'src/app/interfaces/pos-interface';
import { SelectorForm } from 'src/app/components/elements/selectors/selector-form/selector-form';
import { InputForm } from 'src/app/components/elements/inputs/input-form/input-form';

@Component({
  selector: 'app-payments',
  imports: [SelectorForm, InputForm],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments {
  cardTextColor = environment.cardTextColor;
  cardTextColorWarning = environment.cardTextColorWarning;
  cardTextColorGood = environment.cardTextColorGood;

  paymentsService = inject(PaymentsService);

  paymentMethodOptions = input.required<PaymentCategory[]>();
  tabId = input.required<number>();
  paymentsIn = input<payments[]>([]);
  receivedAmountIn = input<number>(0);
  total = input.required<number>();
  resetPaymentsVar = input(false);
  quickAmounts = [50, 100, 200, 500];

  paymentArray = signal<payments[]>([]);
  paymentOutArray = output<payments[]>();
  receivedAmountOut = output<number>();
  hasMissingRequiredReferenceOut = output<boolean>();
  idPaymentSelected = signal<number>(0);
  paymentAmountVar = signal<number>(0);

  constructor() {
    

    effect(() => {
      const shouldResetPayments = this.resetPaymentsVar();
      if (shouldResetPayments) {
        this.resetPayments();
        this.hasMissingRequiredReferenceOut.emit(false);
        return;
      }

      const currentTabId = this.tabId();
      if (!currentTabId) {
        return;
      }

      const incomingPayments = untracked(() => this.paymentsIn());
      const incomingReceivedAmount = untracked(() => this.receivedAmountIn());

      this.paymentArray.set(incomingPayments.map((payment) => ({ ...payment })));
      this.paymentAmountVar.set(incomingReceivedAmount);

      if (incomingPayments.length === 0) {
        this.idPaymentSelected.set(0);
        return;
      }

      if (incomingPayments.length > 1) {
        this.idPaymentSelected.set(0);
        return;
      }

      this.idPaymentSelected.set(incomingPayments[0].metodo_pago_id);
    });
  }

  protected readonly change = computed(() => Math.max(0, this.paymentAmountVar() - this.total()));

  protected readonly isSplitPaymentMode = computed(() => this.isVariosMethod(this.idPaymentSelected()));

  onPaymentMethodChange(value: number): void {
    const parsedValue = value > 0 ? value : 0;
    this.idPaymentSelected.set(parsedValue);

    if (this.isVariosMethod(parsedValue)) {
      this.syncSplitPayments();
      return;
    }

    const selectedMethod = this.paymentMethodOptions().find((option) => option.id === parsedValue);
    if (!selectedMethod) {
      this.paymentArray.set([]);
      this.paymentOutArray.emit([]);
      this.hasMissingRequiredReferenceOut.emit(false);
      return;
    }

    const current = this.paymentArray().find((payment) => payment.metodo_pago_id === parsedValue);
    const nextAmount = current?.monto ?? this.paymentAmountVar();
    const payment: payments = {
      metodo_pago_id: parsedValue,
      metodo: selectedMethod.nombre,
      monto: nextAmount,
      referencia: current?.referencia ?? '',
    };

    this.paymentArray.set([payment]);
    this.paymentAmountVar.set(nextAmount);
    this.receivedAmountOut.emit(nextAmount);
    this.paymentOutArray.emit(nextAmount > 0 ? [payment] : []);
    this.hasMissingRequiredReferenceOut.emit(false);
  }

  setQuickAmount(amount: number): void {
    this.setSinglePaymentAmount(amount);
  }

  setExactAmount(): void {
    this.setSinglePaymentAmount(this.total());
  }

  onAmountReceivedChange(value: string | number): void {
    this.setSinglePaymentAmount(this.parseAmount(value));
  }

  onSplitAmountChange(methodId: number, methodName: string, value: string | number): void {
    this.upsertSplitPayment(methodId, methodName, {
      monto: this.parseAmount(value),
    });
    this.syncSplitPayments();
  }

  onSplitReferenceChange(methodId: number, methodName: string, value: string | number): void {
    this.upsertSplitPayment(methodId, methodName, {
      referencia: String(value ?? '').trim(),
    });
    this.syncSplitPayments();
  }

  getSplitAmount(methodId: number): number | '' {
    const amount = this.paymentArray().find((payment) => payment.metodo_pago_id === methodId)?.monto ?? 0;
    return amount > 0 ? amount : '';
  }

  getSplitReference(methodId: number): string {
    return this.paymentArray().find((payment) => payment.metodo_pago_id === methodId)?.referencia ?? '';
  }

  getnamePayment(id: number): string {
    const paymentMethod = this.paymentMethodOptions().find((option) => option.id === id);
    return paymentMethod ? paymentMethod.nombre : '';
  }

  paymentRequiresReference(method?: PaymentCategory): boolean {
    if (!method) {
      return false;
    }

    const normalized = String(method.requiere_referencia ?? '').trim().toLowerCase();
    return ['si', 'si', 'yes', 'true', '1', 'required'].includes(normalized);
  }

  

  private setSinglePaymentAmount(amount: number): void {
    const normalizedAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
    this.paymentAmountVar.set(normalizedAmount);
    this.receivedAmountOut.emit(normalizedAmount);

    if (this.isVariosMethod(this.idPaymentSelected())) {
      return;
    }

    const selectedMethod = this.paymentMethodOptions().find((option) => option.id === this.idPaymentSelected());
    if (!selectedMethod) {
      this.paymentArray.set([]);
      this.paymentOutArray.emit([]);
      this.hasMissingRequiredReferenceOut.emit(false);
      return;
    }

    const current = this.paymentArray().find((payment) => payment.metodo_pago_id === selectedMethod.id);
    const payment: payments = {
      metodo_pago_id: selectedMethod.id,
      metodo: selectedMethod.nombre,
      monto: normalizedAmount,
      referencia: current?.referencia ?? '',
    };

    this.paymentArray.set([payment]);
    this.paymentOutArray.emit(normalizedAmount > 0 ? [payment] : []);
  }

  private upsertSplitPayment(methodId: number, methodName: string, patch: Partial<payments>): void {
    const current = this.paymentArray();
    const index = current.findIndex((payment) => payment.metodo_pago_id === methodId);

    if (index === -1) {
      const next: payments = {
        metodo_pago_id: methodId,
        metodo: methodName,
        monto: patch.monto ?? 0,
        referencia: patch.referencia ?? '',
      };
      this.paymentArray.set([...current, next]);
      return;
    }

    const updated = current.map((payment, position) =>
      position === index
        ? {
            ...payment,
            ...patch,
          }
        : payment,
    );

    this.paymentArray.set(updated);
  }

  private syncSplitPayments(): void {
    const validSplitPayments = this.paymentArray().filter((payment) => payment.metodo_pago_id > 0 && payment.monto > 0);

    const hasMissingRequiredReference = this.paymentArray().some((payment) => {
      if (payment.metodo_pago_id <= 0 || payment.monto <= 0) {
        return false;
      }

      const method = this.paymentMethodOptions().find((option) => option.id === payment.metodo_pago_id);
      return this.paymentRequiresReference(method) && payment.referencia.trim().length === 0;
    });

    const totalReceived = this.paymentArray().reduce((acc, payment) => acc + (payment.monto > 0 ? payment.monto : 0), 0);
    this.paymentAmountVar.set(totalReceived);
    this.receivedAmountOut.emit(totalReceived);
    this.paymentOutArray.emit(validSplitPayments);
    this.hasMissingRequiredReferenceOut.emit(hasMissingRequiredReference);
  }

  private parseAmount(value: string | number): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  private isVariosMethod(methodId: number): boolean {
    const methodName = this.getnamePayment(methodId).trim().toLowerCase();
    return methodName.includes('varios');
  }


  resetPayments(): void {
    this.paymentAmountVar.set(0);
    this.idPaymentSelected.set(0);
  }
}
