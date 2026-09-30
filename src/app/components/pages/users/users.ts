import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentLabelTable, RowActionEvent, SelectorOption } from 'src/app/interfaces/forms';
import { InputSearchForm } from '../../elements/inputs/input-search-form/input-search-form';
import { ButtonMainForm } from '../../elements/buttons/button-main-form/button-main-form';
import { LabelForm } from '../../elements/labels/label-form/label-form';
import { InputForm } from '../../elements/inputs/input-form/input-form';
import { ButtonSecundaryForm } from '../../elements/buttons/button-secundary-form/button-secundary-form';
import { TableForm } from '../../elements/tables/table-form/table-form';
import { SelectorForm } from '../../elements/selectors/selector-form/selector-form';
import { UserBranch } from './user-branch/user-branch';

type UserRow = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

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
    UserBranch
],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent {
  readonly searchTerm = signal('');
  readonly showCreateSection = signal(false);
  readonly roleOptions: SelectorOption[] = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Supervisor' },
    { id: 3, nombre: 'Cajero' },
  ];
  readonly users = signal<UserRow[]>([
    { id: 1, nombre: 'Ana López', email: 'ana.lopez@example.com', rol: 'Administrador' },
    { id: 2, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', rol: 'Supervisor' },
    { id: 3, nombre: 'María Torres', email: 'maria.torres@example.com', rol: 'Cajero' },
  ]);
  readonly filteredUsers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) {
      return this.users();
    }

    return this.users().filter((user) =>
      `${user.nombre} ${user.email} ${user.rol}`.toLowerCase().includes(search)
    );
  });

  readonly userLabels: ContentLabelTable[] = [
    { id: 1, name: 'Nombre', key: 'nombre' },
    { id: 2, name: 'Correo', key: 'email' },
    { id: 3, name: 'Rol', key: 'rol' },
    { id: 4, name: 'Acciones', key: 'actions' },
  ];

  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl<number | null>(null, Validators.required),
  });

  private nextUserId = 4;

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

  saveUser(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.passwordMismatch()) {
      return;
    }

    const { nombre, email, role } = this.form.getRawValue();
    const rol = this.roleOptions.find((option) => option.id === role)?.nombre ?? '';
    const user: UserRow = { id: this.nextUserId++, nombre, email, rol };

    this.users.update((currentUsers) => [...currentUsers, user]);
    console.log('Usuario agregado localmente:', user);
    this.cancelSave();
  }

  cancelSave(): void {
    this.form.reset();
    this.showCreateSection.set(false);
  }

  onEditUser(event: RowActionEvent<UserRow>): void {
    console.log('Editar usuario:', event.row);
  }

  onDeleteUser(event: RowActionEvent<UserRow>): void {
    console.log('Eliminar usuario:', event.row);
  }

}
