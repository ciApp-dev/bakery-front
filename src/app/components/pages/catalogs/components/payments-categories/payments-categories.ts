import { Component,computed,inject,signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';
import { ToggleSwitch } from "src/app/components/elements/toggle-switch/toggle-switch";
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { ListForm } from "src/app/components/elements/lists/list-form/list-form";
import { environment } from '@environments/environment';
import { PaymentsService } from 'src/app/service/payments-service';
import { PaymentCategory, PaymentCategoryList } from 'src/app/interfaces/payment-interface';
import { map } from 'rxjs';

@Component({
  selector: 'app-payments-categories',
  imports: [ToggleSwitch, InputForm, ListForm],
  templateUrl: './payments-categories.html',
  styleUrl: './payments-categories.css',
})
export class PaymentsCategories {

  confirmDialog = inject(ConfirmDialogService);
  toastService = inject(ToastService);
  paymentsService = inject(PaymentsService);

  



  lblBtn2 = signal<string>('Eliminar');
  iconBtn2 = signal<string>('delete');
  colorBtn2 = signal<string>('text-red-500');

  nameInput = signal<string>('');
  referenceRequire = signal<string>('');

  showDeleted = signal<boolean>(false);

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    referenceRequire: new FormControl<string>(''),
  });

  paymentCategories = signal<PaymentCategoryList []>([]);


  protected readonly cardTextColor = environment.cardTextColor;
  protected readonly cardTextColorBad = environment.cardTextColorBad;

  protected readonly editingId = signal<number | null>(null);
  private readonly nextId = signal(4);
  protected readonly feedback = signal('');

  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar categoria' : 'Nueva categoria',
  );
  protected readonly submitLabel = computed(() =>
    this.isEditing() ? 'Guardar cambios' : 'Agregar categoria',
  );
  

  constructor() {
    this.getPaymentCategories();
  }


onNameInputChange(value: string | number): void {
    this.nameInput.set(String(value));
  }

  onReferenceRequireChange(value: string | number): void {
    this.referenceRequire.set(String(value));
  }

  onShowDeletedChange(value: boolean): void {
    this.showDeleted.set(value);
  }


  async savePaymentCategory(): Promise<void> {

  }

  async removePaymentCategory(event: any): Promise<void> {


  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.nameInput.set('');
    this.referenceRequire.set('');
    this.form.reset();
  }
  
  startEdit(event: any): void {
    
  }


  getPaymentCategories(): void {

    const estado = { estado: this.showDeleted() ? 'INA' : 'ACT' };

    this.paymentsService.getPaymentCategories(estado).subscribe({
      next: (categories: PaymentCategory[]) => {
        this.paymentCategories.set((categories).map(category => ({
          id: category.id,
          name: category.nombre,
          referenceRequire: category.requiere_referencia === '1' ? 'Sí' : 'No',
        })));
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al obtener las categorias de pago', 'Por favor, intenta nuevamente.');
      }
    });


  }
  

}
