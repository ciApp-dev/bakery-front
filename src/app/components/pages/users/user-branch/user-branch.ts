import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonMainForm } from '../../../elements/buttons/button-main-form/button-main-form';
import { ListForm } from '../../../elements/lists/list-form/list-form';
import { SelectorForm } from '../../../elements/selectors/selector-form/selector-form';
import { RowActionEvent, SelectorOption } from 'src/app/interfaces/forms';

type AssignedBranch = {
  id: number;
  nombre: string;
  descripcion: string;
};

@Component({
  selector: 'app-user-branch',
  imports: [ButtonMainForm, ListForm, SelectorForm],
  templateUrl: './user-branch.html',
  styleUrl: './user-branch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBranch {
  readonly branchOptions: SelectorOption[] = [
    { id: 1, nombre: 'Sucursal Centro' },
    { id: 2, nombre: 'Sucursal Norte' },
    { id: 3, nombre: 'Sucursal Sur' },
  ];
  readonly selectedBranchId = signal<number | null>(null);
  readonly showDeleted = signal(false);
  readonly assignedBranches = signal<AssignedBranch[]>([
    { id: 10, nombre: 'Sucursal Aeropuerto', descripcion: 'Sucursal asignada al usuario' },
  ]);

  onBranchSelected(branchId: number): void {
    this.selectedBranchId.set(branchId || null);
  }

  assignBranch(): void {
    const branch = this.branchOptions.find((option) => option.id === this.selectedBranchId());
    if (!branch || this.assignedBranches().some((assigned) => assigned.id === branch.id)) {
      return;
    }

    const assignedBranch: AssignedBranch = {
      id: branch.id,
      nombre: branch.nombre,
      descripcion: 'Sucursal asignada al usuario',
    };
    this.assignedBranches.update((current) => [...current, assignedBranch]);
    console.log('Sucursal asignada:', assignedBranch);
    this.selectedBranchId.set(null);
  }

  onViewBranch(event: RowActionEvent<AssignedBranch>): void {
    console.log('Sucursal asignada:', event.row);
  }

  onRemoveBranch(event: RowActionEvent<AssignedBranch>): void {
    this.assignedBranches.update((current) => current.filter((branch) => branch.id !== event.row.id));
    console.log('Sucursal desasignada:', event.row);
  }
}
