import { Component, input,output } from '@angular/core';
import { ButtonSecundaryForm } from "../../buttons/button-secundary-form/button-secundary-form";
import { RowActionEvent } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-list-form',
  imports: [ButtonSecundaryForm],
  templateUrl: './list-form.html',
  styleUrl: './list-form.css',
})
export class ListForm <L>{



  showDeleted = input.required<boolean>();

  labelBtn1 = input.required<string>();
  labelBtn2 = input.required<string>();
  iconBtn1 = input.required<string>();
  iconBtn2 = input.required<string>();
  colorBtn1 = input.required<string>();
  colorBtn2 = input.required<string>();


  editSelected = output<RowActionEvent<L>>();
  deleteSelected = output<RowActionEvent<L>>();
  pressBtn1 = output<void>();
  pressBtn2 = output<void>();
  idSelected = output<number>();


  content = input.required<L[]>();
  private readonly primaryObjectKeys = ['nombre', 'name', 'titulo', 'title'];
  private readonly secondaryObjectKeys = ['descripcion', 'description', 'detalle', 'detail'];

  getTrackKey(row: L, index: number): unknown {
    const raw = row as unknown;

    if(Array.isArray(raw)) {
      return raw.length > 0 ? raw[0] : index;
    }

    if(raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;

      if(record['id'] !== undefined && record['id'] !== null) {
        return record['id'];
      }
    }

    return index;
  }

  getRowId(row: L): unknown {
    const raw = row as unknown;

    if (Array.isArray(raw)) {
      return raw.length > 0 ? raw[0] : '';
    }

    if (raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;
      if (record['id'] !== undefined && record['id'] !== null) {
        return record['id'];
      }
    }

    return '';
  }

  getPrimaryValue(row: L): string {
    const raw = row as unknown;

    if (Array.isArray(raw)) {
      return this.toDisplayString(raw.length > 1 ? raw[1] : '');
    }

    if (raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;

      for (const key of this.primaryObjectKeys) {
        if (record[key] !== undefined && record[key] !== null) {
          return this.toDisplayString(record[key]);
        }
      }
    }

    return '';
  }

  getSecondaryValue(row: L): string {
    const raw = row as unknown;

    if (Array.isArray(raw)) {
      return this.toDisplayString(raw.length > 2 ? raw[2] : '');
    }

    if (raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;

      for (const key of this.secondaryObjectKeys) {
        if (record[key] !== undefined && record[key] !== null) {
          return this.toDisplayString(record[key]);
        }
      }
    }

    return '';
  }

  hasSecondaryValue(row: L): boolean {
    return this.getSecondaryValue(row).trim().length > 0;
  }

  private toDisplayString(value: unknown): string {
    return value === undefined || value === null ? '' : String(value);
  }


  onAction1(row: L): void {
    const id = this.getRowId(row);
    this.editSelected.emit({
      id: String(id),
      row: row
     });

     this.idSelected.emit(Number(id));
     this.pressBtn1.emit();
  }

  onAction2(row: L): void {
    const id = this.getRowId(row);
    this.deleteSelected.emit({
      id: String(id),
      row: row
     });

     this.idSelected.emit(Number(id));
     this.pressBtn2.emit();

  }
}
