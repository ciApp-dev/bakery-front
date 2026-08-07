import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoriaService } from 'src/app/service/categoria-service';
import { environment } from '@environments/environment';
import { InputLabel } from "src/app/components/elements/inputs/input-label/input-label";
import { InputForm } from "src/app/components/elements/inputs/input-form/input-form";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { categoryListInterface } from 'src/app/interfaces/categories-interface';
import { genericResponse } from 'src/app/interfaces/responses';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';
import { statusRequest } from 'src/app/interfaces/request';
import { ToggleSwitch } from "src/app/components/elements/toggle-switch/toggle-switch";
import { ListForm } from "src/app/components/elements/lists/list-form/list-form";
import { RowActionEvent } from 'src/app/interfaces/forms';

interface CategoryRegister {
  id: number;
  name: string;
}

@Component({
  selector: 'app-products-categories',
  imports: [InputLabel, InputForm, ToggleSwitch, ListForm],
  templateUrl: './products-categories.html',
  styleUrl: './products-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsCategoriesComponent {


  categoriesService = inject(CategoriaService);
  confirmDialog = inject(ConfirmDialogService);
  toastService = inject(ToastService);



  nameInput = signal<string>('');
  descriptionInput = signal<string>('');
  
  showDeleted = signal<boolean>(false);

  lblBtn2 = signal<string>('Eliminar');
  iconBtn2 = signal<string>('delete');
  colorBtn2 = signal<string>('text-red-500');

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
  });

  protected readonly cardTextColor = environment.cardTextColor;
  protected readonly cardTextColorBad = environment.cardTextColorBad;

categories = signal<categoryListInterface[]>([]);

  
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
    this.getCategories();
  }

 

  onNameChange(value: string | number): void {
    this.nameInput.set(String(value));
  }

  onDescriptionChange(value: string | number): void {
    this.descriptionInput.set(String(value));
  }

  onShowDeletedChange(value: boolean): void {
    this.showDeleted.set(value);
    this.lblBtn2.set(value ? 'Reactivar' : 'Eliminar');
    this.iconBtn2.set(value ? 'refresh' : 'delete');
    this.colorBtn2.set(value ? 'text-green-500' : 'text-red-500');
    this.getCategories();
  }

  
  async saveCategory(): Promise<void> {
    const data = {
      nombre: this.nameInput().trim(),
      descripcion: this.descriptionInput().trim() || undefined,
    };

    const currentEditingId = this.editingId();
    if (currentEditingId !== null) {

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar acción',
        message: `¿Está seguro de actualizar la categoria "${data.nombre}"?`,
        confirmLabel: 'Sí, actualizar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }
      
      this.categoriesService.updateCategoria(currentEditingId, data).subscribe({
        next: (updatedCategory) => {
          this.getCategories();
          this.toastService.showSuccessToast('Categoria actualizada correctamente.');
          this.cancelEdit();
        },
        error: (error: genericResponse) => {
          this.toastService.showErrorToast('Error al actualizar categoria', error.mensaje);
        }
      });


    } else {

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar acción',
        message: `¿Está seguro de agregar la categoria "${data.nombre}"?`,
        confirmLabel: 'Sí, agregar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }
    
      this.categoriesService.saveCategoria(data).subscribe({
        next: (newCategory) => {
          this.categories.update((items) => [...items, newCategory]);
          this.toastService.showSuccessToast('Categoria agregada correctamente.');
          this.cancelEdit();
          this.getCategories();
        },
        error: (error: genericResponse) => {
          
          this.toastService.showErrorToast('Error al agregar categoria', error.mensaje);
        }
      });
    }
  }

  protected startEdit(event: RowActionEvent<categoryListInterface>): void {
    const categoryId = event.row.id;
    const target = this.categories().find((item) => item.id === categoryId);
    if (!target) {
      return;
    }

    this.editingId.set(categoryId);
    this.nameInput.set(target.nombre);
    this.descriptionInput.set(target.descripcion ?? '');
    this.feedback.set('Modo edicion activo.');
  }


  editCategory(event: RowActionEvent<categoryListInterface>): void {
    console.log('Editar categoria:', event.row.id);
  }

  

  async removeCategory(event: RowActionEvent<categoryListInterface>): Promise<void> {

    const categoryId = event.row.id;
    const categoryName = event.row.nombre;
    

    if(!this.showDeleted()){

      const confirm = await this.confirmDialog.confirm({
      title: 'Confirmar acción',
      message: `¿Está seguro de eliminar la categoria "${categoryName}"?`,
      confirmLabel: 'Sí, eliminar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true
    });

    if(!confirm) {
      return;
    }

    this.categoriesService.deleteCategoria(categoryId).subscribe({
      next: () => {
        this.getCategories();
        this.toastService.showSuccessToast('Categoria eliminada correctamente.');
        if (this.editingId() === categoryId) {
          this.cancelEdit();
        }
        this.getCategories();
      },
      error: (error: genericResponse) => {
        this.toastService.showErrorToast('Error al eliminar categoria', error.mensaje);
      }
    });

    }else{

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar acción',
        message: `¿Está seguro de reactivar la categoria "${categoryName}"?`,
        confirmLabel: 'Sí, reactivar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }

      this.categoriesService.reactivateCategoria(categoryId).subscribe({
        next: () => {
          this.getCategories();
          this.toastService.showSuccessToast('Categoria reactivada correctamente.');
          if (this.editingId() === categoryId) {
            this.cancelEdit();
          }
          this.getCategories();
        },
        error: (error: genericResponse) => {
          this.toastService.showErrorToast('Error al reactivar categoria', error.mensaje);
        }
      });
    }

    
    
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.nameInput.set('');
    this.descriptionInput.set('');
    this.feedback.set('');
  }

  protected updateNameInput(value: string): void {
    this.nameInput.set(value);
  }




   getCategories(): void {

    const estado: statusRequest  ={
      estado: this.showDeleted() ? 'INA' : 'ACT'
    }
    
    this.categoriesService.getCategorias(estado).subscribe({
      next: (categories: categoryListInterface[]) => {
        console.log('Categorias obtenidas:', categories);
        this.categories.set(categories);
      },
      error: (error: genericResponse) => {
        console.error('Error al obtener categorias:', error);
        this.feedback.set('Error al obtener categorias: ' + error.mensaje);
      }
    });
  }



}
