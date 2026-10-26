import { Component, computed, signal, inject } from '@angular/core';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog-service';
import { ToastService } from 'src/app/service/toast-service';
import { UsersService } from 'src/app/service/users-service';
import { SucursalesService } from 'src/app/service/sucursales-service';

import { UserData, UserDataRequest, UserDataTable, UserUpdateRequest } from 'src/app/interfaces/users-interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentLabelTable, ElementsList, RowActionEvent, SelectorOption } from 'src/app/interfaces/forms';
import { InputSearchForm } from '../../elements/inputs/input-search-form/input-search-form';
import { ButtonMainForm } from '../../elements/buttons/button-main-form/button-main-form';
import { LabelForm } from '../../elements/labels/label-form/label-form';
import { InputForm } from '../../elements/inputs/input-form/input-form';
import { ButtonSecundaryForm } from '../../elements/buttons/button-secundary-form/button-secundary-form';
import { TableForm } from '../../elements/tables/table-form/table-form';
import { SelectorForm } from '../../elements/selectors/selector-form/selector-form';
import { UserBranch } from './user-branch/user-branch';
import { RolService } from 'src/app/service/rol-service';
import { ListAssignments } from '../../elements/lists/list-assignments/list-assignments';
import { ToggleSwitch } from '../../elements/toggle-switch/toggle-switch';


@Component({
  selector: 'app-users',
  imports: [
    InputSearchForm,
    ButtonMainForm,
    LabelForm,
    InputForm,
    ButtonSecundaryForm,
    TableForm,
    ReactiveFormsModule,
    SelectorForm,
    ListAssignments,
    ToggleSwitch
],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent {
  usersService = inject(UsersService);
  roleService = inject(RolService);
  branchesService = inject(SucursalesService);
  toastService = inject(ToastService);
  confirmDialogService = inject(ConfirmDialogService);


  readonly searchTerm = signal('');
  readonly showCreateSection = signal(false);
  
  roleOptions = signal<SelectorOption[]>([]);
  users = signal<UserDataTable[]>([]);
  allBranches = signal<ElementsList[]>([]);
  assignedBranches = signal<ElementsList[]>([]);

  modeForm = signal<'create' | 'edit'>('create');
  idSelectedUser = signal<number | null>(null);

  showDeletedUsers = signal(false);
  showPendingUsers = signal(false);

  lblBtn2 = signal('Eliminar');
  iconBtn2 = signal('delete');
  colorBtn2 = signal('text-red-500');

  readonly filteredUsers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) {
      return this.users();
    }

    return this.users().filter((user) =>
      `${user.name} ${user.email} ${user.roleName} ${user.branch}`.toLowerCase().includes(search)
    );
  });

  readonly userLabels: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'name' },
    { id: 2, name: 'Correo', key: 'email' },
    { id: 3, name: 'Rol', key: 'roleName' },
    { id: 4, name: 'Sucursal', key: 'branch' },
    { id: 5, name: 'Acciones', key: 'actions' },
  ];

  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: false, validators: [ Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: false,  }),
    role: new FormControl<number | null>(null, Validators.required),
  });

  private nextUserId = 4;


  constructor() {
    this.getUsers();
    this.getRoleOptions();
    this.getBranches();
  }


  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onNombreChange(value: string | number): void {
    this.form.controls.nombre.setValue(String(value));
    this.form.controls.nombre.markAsTouched();
  }

  onEmailChange(value: string | number): void {
    this.form.controls.email.setValue(String(value));
    this.form.controls.email.markAsTouched();
  }

  onPasswordChange(value: string | number): void {
    this.form.controls.password.setValue(String(value));
    this.form.controls.password.markAsTouched();
  }

  onConfirmPasswordChange(value: string | number): void {
    this.form.controls.confirmPassword.setValue(String(value));
    this.form.controls.confirmPassword.markAsTouched();
  }

  onRoleChange(value: number): void {
    this.form.controls.role.setValue(value || null);
    this.form.controls.role.markAsTouched();
  }

  passwordMismatch(): boolean {
    const { password, confirmPassword } = this.form.getRawValue();
    return this.form.controls.confirmPassword.touched && password !== confirmPassword;
  }

  async saveUser(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.passwordMismatch()) {
      return;
    }

    

    if(this.modeForm() === 'edit') {

      const confirm = await this.confirmDialogService.confirm({
        title: 'Confirmar actualización',
        message: '¿Estás seguro de que deseas actualizar este usuario?',
        confirmLabel: 'Actualizar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true,
      });
      if (!confirm) {
        return;
      }

      const selectedRoleId = this.form.controls.role.value;
      const roleName = this.roleOptions().find((role) => role.id === selectedRoleId)?.nombre;
      const password = this.form.controls.password.value;

      if (!roleName) {
        return;
      }

      const userData: UserDataRequest = {
        name: this.form.controls.nombre.value,
        email: this.form.controls.email.value,
        estado: 'ACT',
        role: roleName,
        sucursales: this.assignedBranches().map((branch) => branch.id),
        ...(password
          ? {
              password,
              password_confirmation: this.form.controls.confirmPassword.value ?? '',
            }
          : {}),
      };

    console.log('Updating user with data:', userData);

    this.usersService.updateUser(Number(this.idSelectedUser()), userData).subscribe({
      next: () => {
        this.toastService.showSuccessToast('Usuario actualizado correctamente');
        this.getUsers();
        this.clearForm();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al actualizar el usuario', error);
        console.error('Error updating user:', error);
      },
    });

    }else{

      const confirm = await this.confirmDialogService.confirm({
        title: 'Confirmar creación',
        message: '¿Estás seguro de que deseas crear este usuario?',
        confirmLabel: 'Crear',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true,
      });
      if (!confirm) {
        return;
      }

      const selectedRoleId = this.form.controls.role.value;
      const roleName = this.roleOptions().find((role) => role.id === selectedRoleId)?.nombre;
      const password = this.form.controls.password.value;

      if (!roleName) {
        return;
      }

      const userData: UserDataRequest = {
        name: this.form.controls.nombre.value,
        email: this.form.controls.email.value,
        estado: 'ACT',
        role: roleName,
        sucursales: this.assignedBranches().map((branch) => branch.id),
        ...(password
          ? {
              password,
              password_confirmation: this.form.controls.confirmPassword.value ?? '',
            }
          : {}),
      };

      

      this.usersService.createUser(userData).subscribe({
        next: () => {
          this.toastService.showSuccessToast('Usuario creado correctamente');
          this.getUsers();
          this.clearForm();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al crear el usuario', error);
          console.error('Error creating user:', error);
        },
      });
    }
    
  }

  cancelSave(): void {
   this.clearForm();
  }

  onEditUser(event: RowActionEvent<UserDataTable>): void {

    
    this.modeForm.set('edit');
    this.onNombreChange(event.row.name);
    this.onEmailChange(event.row.email);
    this.showCreateSection.set(true);

    this.form.patchValue({
      nombre: event.row.name,
      email: event.row.email,
      role: event.row.roles.length > 0 ? event.row.roles[0].id : null,
    });

    this.form.markAsTouched();

    this.idSelectedUser.set(event.row.id);
    this.getAssignedBranches(event.row.id);
    this.showCreateSection.set(true);
  }

  async onDeleteUser(event: RowActionEvent<UserDataTable>): Promise<void> {

    if(this.showDeletedUsers() || this.showPendingUsers()){
      const confirm = await this.confirmDialogService.confirm({
        title: 'Confirmar reactivación',
        message: '¿Estás seguro de que deseas reactivar al usuario ' + event.row.name + '?',
        confirmLabel: 'Reactivar',
        cancelLabel: 'Cancelar',
        destructive: true,
        closeOnBackdrop: true,
      });
      if (!confirm) {
        return;
      }

      this.usersService.activateUser(event.row.id).subscribe({
        next: () => {
          this.toastService.showSuccessToast('Usuario reactivado correctamente');
          this.getUsers();
        },
        error: (error) => {
          this.toastService.showErrorToast('Error al reactivar el usuario', error);
          console.error('Error reactivating user:', error);
        },
      });
    }else if(!this.showDeletedUsers() && !this.showPendingUsers()){

      const confirm = await this.confirmDialogService.confirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar al usuario ' + event.row.name + '?',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      destructive: true,
      closeOnBackdrop: true,
    });
    if (!confirm) {
      return;
    }

    this.usersService.deleteUser(event.row.id).subscribe({
      next: () => {
        this.toastService.showSuccessToast('Usuario eliminado correctamente');
        this.getUsers();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error al eliminar el usuario', error);
        console.error('Error deleting user:', error);
      },
    });
    }
    
  }


  getUsers(): void {
     
    const estado = this.showDeletedUsers() ? 'INA' : this.showPendingUsers() ? 'PEN' : 'ACT';
    this.usersService.getUsers(estado).subscribe({
      next: (users) => {
        
        this.users.set(users.map((user) => ({
          ...user,
          branch: user.sucursales.map((sucursal) => sucursal.nombre).join(', '),
          roleName: user.roles.map((role) => role.name).join(', '),
        })));

        
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users.set([]);
      },
    });
  }

  getRoleOptions(): void {
    const estado = { estado: 'ACT' };
    this.roleService.getRoles(estado).subscribe({
      next: (roles) => {
        this.roleOptions.set(roles.map((role) => ({ id: role.id, nombre: role.name })));
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.roleOptions.set([]);
      },
    });
  }

  getBranches(): void {
    const estado = { estado: 'ACT' };
    this.branchesService.getSucursales(estado).subscribe({
      next: (branches) => {
        this.allBranches.set(branches.map((branch) => ({ id: branch.id, name: branch.nombre, description: `branch ${branch.direccion} ${branch.ciudad} ${branch.estado}` })));
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.allBranches.set([]);
      },
    });
  }


  getAssignedBranches(idUser:number): void {
    this.assignedBranches.set(this.users().find(user => user.id === idUser)?.sucursales.map((sucursal) => ({ id: sucursal.id, name: sucursal.nombre, description: `branch ${sucursal.direccion} ${sucursal.ciudad} ${sucursal.estado}` })) || []);
   
  }

  assignedBranchesChange(updatedBranches: ElementsList[]):void{
    const userId = this.idSelectedUser();
    if (userId === null) {
      return;
    }

    const selectedRoleId = this.form.controls.role.value;
    const roleName = this.roleOptions().find((role) => role.id === selectedRoleId)?.nombre;
    if (!roleName) {
      console.error('Cannot update user: selected role was not found.');
      return;
    }

    const data: UserUpdateRequest = {
      name: this.form.controls.nombre.value,
      email: this.form.controls.email.value,
      role: roleName,
      sucursales: updatedBranches.map((branch) => branch.id),
    };

    console.log('Updated branches data:', data);
    
    this.usersService.updateBranchUser(userId, data).subscribe({
      next: (updatedUser) => {
        
        this.getUsers();
        this.clearForm();
        this.modeForm.set('create');
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
    
  }

  onShowDeletedChange(value: boolean): void {
    this.showDeletedUsers.set(value);
    if(this.showPendingUsers()) {
      this.showPendingUsers.set(false);
    }
    this.lblBtn2.set(value ? 'Recuperar' : 'Eliminar');
    this.iconBtn2.set(value ? 'refresh' : 'delete');
    this.colorBtn2.set(value ? 'text-green-500' : 'text-red-500');
    this.getUsers();

  }

  onShowPendingChange(value: boolean): void {
    this.showPendingUsers.set(value);
    if(value) {
      this.showDeletedUsers.set(false);
    }
    this.lblBtn2.set(this.showPendingUsers() ? 'Activar' : 'Eliminar');
    this.iconBtn2.set(this.showPendingUsers() ? 'check' : 'delete');
    this.colorBtn2.set(this.showPendingUsers() ? 'text-green-500' : 'text-red-500');
    this.getUsers();
  }

  clearForm(): void {
    this.form.reset();
    this.showCreateSection.set(false);
    this.modeForm.set('create');
    this.idSelectedUser.set(null);
    this.assignedBranches.set([]);
  }
}


