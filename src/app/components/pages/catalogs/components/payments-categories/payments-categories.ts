import { Component,computed,inject,signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';
import { ToggleSwitch } from "src/app/components/elements/toggle-switch/toggle-switch";
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { ListForm } from "src/app/components/elements/lists/list-form/list-form";
import { environment } from '@environments/environment';
import { PaymentsService } from 'src/app/service/payments-service';
import { PaymentCategory, PaymentCategoryList, PaymentCategoryRequest } from 'src/app/interfaces/payment-interface';
import { map } from 'rxjs';
import { RowActionEvent } from 'src/app/interfaces/forms';

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

  idEditing = signal<number | null>(null);
  nameInput = signal<string>('');
  referenceRequire = signal<boolean>(false);
  modeForm = signal<string>('create');

  showDeleted = signal<boolean>(false);

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    referenceRequire: new FormControl<boolean>(false, Validators.required),
  });

  paymentCategories = signal<PaymentCategoryList []>([]);


  protected readonly cardTextColor = environment.cardTextColor;
  protected readonly cardTextColorBad = environment.cardTextColorBad;

  
  private readonly nextId = signal(4);
  protected readonly feedback = signal('');

  protected readonly isEditing = computed(() => this.idEditing() !== null);
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
    this.form.controls['name'].setValue(String(value));
    this.form.controls['name'].markAsTouched();
  }

  onReferenceRequireChange(value: boolean): void {
    this.referenceRequire.set(Boolean(value));
    this.form.controls['referenceRequire'].setValue(Boolean(value));
    this.form.controls['referenceRequire'].markAsTouched();

  }

  onShowDeletedChange(value: boolean): void {
    this.showDeleted.set(value);
    this.getPaymentCategories();
    this.lblBtn2.set(value ? 'Reactivar' : 'Eliminar');
    this.iconBtn2.set(value ? 'refresh' : 'delete');
    this.colorBtn2.set(value ? 'text-green-500' : 'text-red-500');
  }


  async savePaymentCategory(): Promise<void> {

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: PaymentCategoryRequest = {
      id: this.idEditing() || undefined,
      nombre: this.nameInput(),
      requiere_referencia: this.referenceRequire() ? '1' : '0',
    };



    if (this.modeForm() === 'create' ) {
      
      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar creación',
        message: '¿Está seguro de que desea crear esta categoría de pago?',
        confirmLabel: 'Crear',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });
      if (!confirm) {
        return;
      }

      this.paymentsService.savePaymentCategory(data).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Categoría de pago creada exitosamente');
          this.getPaymentCategories();
          this.cancelEdit();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al crear la categoría de pago', 'Por favor, intenta nuevamente.');
        }
      });


    }else{

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar actualización',
        message: '¿Está seguro de que desea actualizar esta categoría de pago?',
        confirmLabel: 'Actualizar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true
      });
      if (!confirm) {
        return;
      }

      this.paymentsService.editPaymentCategory(data.id!, data).subscribe({
        next: (response) => {
          this.toastService.showSuccessToast('Categoría de pago actualizada exitosamente');
          this.getPaymentCategories();
          this.cancelEdit();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al actualizar la categoría de pago', 'Por favor, intenta nuevamente.');
        }
      }); 

    }


  }

  async removePaymentCategory(event: any): Promise<void> {

    const categoryId = event.row.id;
    const categoryName = event.row.name;


    if(!this.showDeleted()){

    const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar acción',
      message: `¿Está seguro de eliminar la categoría "${categoryName}"?`,
      confirmLabel: 'Sí, eliminar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true
    });

    if(!confirm) {
      return;
    }

    this.paymentsService.deletePaymentCategory(categoryId).subscribe({
      next: () => {
        this.getPaymentCategories();
        this.toastService.showSuccessToast('Categoría eliminada correctamente.');
        if (this.idEditing() === categoryId) {
          this.cancelEdit();
        }
        this.getPaymentCategories();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al eliminar categoría', 'Por favor, intenta nuevamente.');
      }
    });

  }else{
    
    const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar acción',
      message: `¿Está seguro de reactivar la categoría "${categoryName}"?`,
      confirmLabel: 'Sí, reactivar',
      cancelLabel: 'Cancelar',
      destructive: false,
      closeOnBackdrop: true
    });

    if(!confirm) {
      return;
    }

    this.paymentsService.reactivePaymentCategory(categoryId).subscribe({
      next: () => {
        this.getPaymentCategories();
        this.toastService.showSuccessToast('Categoría reactivada correctamente.');
        if (this.idEditing() === categoryId) {
          this.cancelEdit();
        }
        this.getPaymentCategories();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al reactivar categoría', 'Por favor, intenta nuevamente.');
      }
    }); 
  }

  }

  cancelEdit(): void {
    this.idEditing.set(null);
    this.modeForm.set('create');
    this.nameInput.set('');
    this.referenceRequire.set(false);
    this.form.reset();
  }
  
  startEdit(event: RowActionEvent<PaymentCategoryList>): void {
    
    this.modeForm.set('edit');
    this.idEditing.set(event.id as number);
    this.nameInput.set(event.row.name);
    this.referenceRequire.set(event.row.referenceRequire === 'Requiere referencia: Si');
    this.form.controls['name'].setValue(event.row.name);
    this.form.controls['referenceRequire'].setValue(event.row.referenceRequire === 'Requiere referencia: Si');
  }


  getPaymentCategories(): void {

    const estado = { estado: this.showDeleted() ? 'INA' : 'ACT' };

    this.paymentsService.getPaymentCategories(estado).subscribe({
      next: (categories: PaymentCategory[]) => {

        console.log('Fetched Payment Categories:', categories);
        this.paymentCategories.set((categories).map(category => ({
          id: category.id,
          name: category.nombre,
          referenceRequire: Number(category.requiere_referencia) === 1 ? 'Requiere referencia: Si' : 'Requiere referencia: No',
        })));


        console.log('Payment Categories:', this.paymentCategories());
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al obtener las categorias de pago', 'Por favor, intenta nuevamente.');
      }
    });


    
  }
  

}
