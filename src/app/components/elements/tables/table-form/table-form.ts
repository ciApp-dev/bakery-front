import { Component, computed, signal, input, output } from '@angular/core';
import { ContentLabelTable, RowActionEvent } from 'src/app/interfaces/forms';
import { ButtonSecundaryForm } from '../../buttons/button-secundary-form/button-secundary-form';



@Component({
  selector: 'app-table-form',
  imports: [ButtonSecundaryForm],
  templateUrl: './table-form.html',
  styleUrl: './table-form.css',
})
export class TableForm <T>{

  label = input.required<string>();

  activeAction = input.required<boolean>();

  contentLabel = input.required<ContentLabelTable[]>();
  content = input.required<T[]>();

  editSelected = output<RowActionEvent<T>>();
  deleteSelected = output<RowActionEvent<T>>();
  pressedEdit = output<void>();
  pressedDelete = output<void>();
  idSelected = output<number>();


  readonly pageSize = signal(5);
   currentPage = signal(1);
  pageSizeInput = signal('5');

  readonly normalizedRows = computed<T[]>(() => {
    const rawContent = this.content() as unknown;
    return Array.isArray(rawContent) ? rawContent : [];
  });
  

  onEdit(row: T): void {
    const id = this.getTrackKey(row, 0);
    this.editSelected.emit({
      id: String(id),
      row,
    });

    this.idSelected.emit(Number(id));
    this.pressedEdit.emit();
  }

  onDelete(row: T): void {
    const id = this.getTrackKey(row, 0);

    this.deleteSelected.emit({
      id: String(id),
      row,
    });
    
    this.idSelected.emit(id as number);
    this.pressedDelete.emit();
  }


  // Computed properties for pagination
  totalPages = computed(() => Math.max(1, Math.ceil(this.normalizedRows().length / this.pageSize())));
  paginatedRows = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();

    return this.normalizedRows().slice(startIndex, startIndex + this.pageSize());
  });

  onPageSizeInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value.trim();

    this.pageSizeInput.set(rawValue);

    if (rawValue === '') {
      return;
    }

    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    this.applyPageSize(parsedValue);
  }

  applyPageSize(rawValue: number | string | null = null): void {
    const parsedValue = Number(rawValue ?? this.pageSizeInput());

    if (Number.isNaN(parsedValue)) {
      this.pageSizeInput.set(String(this.pageSize()));
      return;
    }

    const nextPageSize = Math.max(1, Math.floor(parsedValue));
    this.pageSize.set(nextPageSize);
    this.currentPage.set(1);
    this.pageSizeInput.set(String(nextPageSize));
  }


  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  // Helper methods for table rendering

  getTrackKey(row: T, index: number): unknown {
    const raw = row as unknown;

    if (Array.isArray(raw)) {
      return raw.length > 0 ? raw[0] : index;
    }

    if (raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;

      if (record['id'] !== undefined && record['id'] !== null) {
        return record['id'];
      }
    }

    return index;
  }

  getCellValue(row: T, column: ContentLabelTable, columnIndex: number): unknown {
    const raw = row as unknown;

    if (Array.isArray(raw)) {
      return raw[columnIndex] ?? '';
    }

    if (raw !== null && typeof raw === 'object') {
      const record = raw as Record<string, unknown>;
      return record[column.key] ?? '';
    }

    return '';
  }

  formatCellValue(value: unknown, column: ContentLabelTable): string {
    if (value === null || value === undefined) {
      return '';
    }

    const rawText = String(value);
    const normalizedName = column.name.toLowerCase();
    const normalizedKey = column.key.toLowerCase();
    const isPriceColumn =
      normalizedName === 'price' ||
      normalizedKey === 'price' ||
      normalizedName === 'precio' ||
      normalizedKey === 'precio';

    if (!isPriceColumn) {
      return rawText;
    }

    const trimmed = rawText.trim();
    return trimmed.startsWith('$') ? trimmed : `$${trimmed}`;
  }
}
