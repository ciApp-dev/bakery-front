import { Component, input, signal, computed } from '@angular/core';
import { ContentLabelTable } from 'src/app/interfaces/forms';


@Component({
  selector: 'app-table-status',
  imports: [],
  templateUrl: './table-status.html',
  styleUrl: './table-status.css',
})
export class TableStatus <T> {

  label = input.required<string>();
  
  contentLabel = input.required<ContentLabelTable[]>();
  content = input.required<T>();

  readonly pageSize = signal<number>(5);
  currentPage = signal<number>(1);
  pageSizeInput = signal<string>('5');

  readonly normalizeRows = computed<T[]>(() => {
    const rawContent = this.content() as unknown;
    return Array.isArray(rawContent) ? rawContent : []; 
   });



   totalPages = computed(() => Math.max(1, Math.ceil(this.normalizeRows().length / this.pageSize())));
  paginatedRows = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();

    return this.normalizeRows().slice(startIndex, startIndex + this.pageSize());
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

  formatStatus(value: unknown): string {
    const normalized = String(value ?? '').toUpperCase();

    if (normalized === 'ACT') {
      return 'Activo';
    }

    if (normalized === 'CAN') {
      return 'Cancelado';
    }

    if (normalized === 'INA') {
      return 'Inactivo';
    }

    return String(value ?? 'N/A');
  }

  statusBadgeClass(value: unknown): string {
    const normalized = String(value ?? '').toUpperCase();

    if (normalized === 'ACT') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    }

    if (normalized === 'CAN') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    }

    if (normalized === 'INA') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
    }

    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }


  }
