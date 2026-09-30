import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { InputForm } from 'src/app/components/elements/inputs/input-form/input-form';
import { ListForm } from 'src/app/components/elements/lists/list-form/list-form';
import { ToggleSwitch } from 'src/app/components/elements/toggle-switch/toggle-switch';
import { RowActionEvent } from 'src/app/interfaces/forms';
import { statusRequest } from 'src/app/interfaces/request';
import { genericResponse } from 'src/app/interfaces/responses';
import { RoleCategory, RoleRequest } from 'src/app/interfaces/roles-interface';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { RolService } from 'src/app/service/rol-service';
import { ToastService } from 'src/app/service/toast-service';



@Component({
  selector: 'app-rol-categories',
  imports: [InputForm, ListForm, ToggleSwitch],
  templateUrl: './rol-categories.html',
  styleUrl: './rol-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolCategoriesComponent {
  rolService = inject(RolService);
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
    description: new FormControl<string>('', )
  });

  protected readonly cardTextColor = environment.cardTextColor;
  protected readonly cardTextColorBad = environment.cardTextColorBad;

roles = signal<RoleCategory[]>([]);

  
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
    this.getRoles();
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
    this.getRoles();
  }

  
  async saveCategory(): Promise<void> {
    const data: RoleRequest = {
      name: this.nameInput().trim(),
      descripcion: this.descriptionInput().trim() || undefined,
    };

    const currentEditingId = this.editingId();
    if (currentEditingId !== null) {

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar acción',
        message: `¿Está seguro de actualizar la categoria "${data.name}"?`,
        confirmLabel: 'Sí, actualizar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }

      this.rolService.updateRole(currentEditingId, data).subscribe({
        next: (updatedRole) => {
          this.roles.update((items) =>
            items.map((item) => (item.id === updatedRole.id ? updatedRole : item))
          );
          this.toastService.showSuccessToast('Categoria actualizada correctamente.');
          this.cancelEdit();
          this.getRoles();
        },
        error: (error: genericResponse) => {
          this.toastService.showErrorToast('Error al actualizar categoria', error.mensaje);
        }
      });


    } else {

      const confirm = await this.confirmDialog.confirm({
        title: 'Confirmar acción',
        message: `¿Está seguro de agregar la categoria "${data.name}"?`,
        confirmLabel: 'Sí, agregar',
        cancelLabel: 'Cancelar',
        destructive: false,
        closeOnBackdrop: true
      });

      if(!confirm) {
        return;
      }
    
      this.rolService.saveRole(data).subscribe({
        next: (newRole) => {
          this.roles.update((items) => [...items, newRole]);
          this.toastService.showSuccessToast('Categoria agregada correctamente.');
          this.cancelEdit();
          this.getRoles();
        },
        error: (error: genericResponse) => {
          this.toastService.showErrorToast('Error al agregar categoria', error.mensaje);
        }
      });
   
    }
  }

  protected startEdit(event: RowActionEvent<RoleCategory>): void {
    const categoryId = event.row.id;
    const target = this.roles().find((item) => item.id === categoryId);
    if (!target) {
      return;
    }

    this.editingId.set(categoryId);
    this.nameInput.set(target.name);
    this.descriptionInput.set(target.descripcion ?? '');
    this.feedback.set('Modo edicion activo.');
  }


  editCategory(event: RowActionEvent<RoleCategory>): void {
    console.log('Editar categoria:', event.row.id);
  }

  

  async removeCategory(event: RowActionEvent<RoleCategory>): Promise<void> {

    const categoryId = event.row.id;
    const categoryName = event.row.name;
    

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

    this.rolService.deleteRole(categoryId).subscribe({
      next: () => {
        this.getRoles();
        this.toastService.showSuccessToast('Categoria eliminada correctamente.');
        if (this.editingId() === categoryId) {
          this.cancelEdit();
        }
        this.getRoles();
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

      this.rolService.reactivateRole(categoryId).subscribe({
        next: () => {
          this.getRoles();
          this.toastService.showSuccessToast('Categoria reactivada correctamente.');
          if (this.editingId() === categoryId) {
            this.cancelEdit();
          }
          this.getRoles();
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




   getRoles(): void {

    const estado: statusRequest  ={
      estado: this.showDeleted() ? 'INA' : 'ACT'
    }
    

    this.rolService.getRoles(estado).subscribe({
      next: (response: RoleCategory[]) => {
        const roles = this.getRoleList(response);
        console.log('Roles obtenidos:', roles);
        this.roles.set(roles);
      },
      error: (error: genericResponse) => {
        console.error('Error al obtener roles:', error);
        this.feedback.set('Error al obtener roles: ' + error.mensaje);
      }
    });

  }

  private getRoleList(response: unknown): RoleCategory[] {
    if (Array.isArray(response)) {
      return response as RoleCategory[];
    }

    if (response !== null && typeof response === 'object') {
      const payload = response as Record<string, unknown>;
      const roleList = payload['roles'] ?? payload['data'];

      if (Array.isArray(roleList)) {
        return roleList as RoleCategory[];
      }
    }

    console.error('Unexpected roles response format:', response);
    return [];
  }
}
