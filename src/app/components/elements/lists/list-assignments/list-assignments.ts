import { Component, computed, effect, input, output, signal } from '@angular/core';
import type { ElementsList } from 'src/app/interfaces/forms';

@Component({
  selector: 'app-list-assignments',
  templateUrl: './list-assignments.html',
  styleUrl: './list-assignments.css',
})
export class ListAssignments {

  allElements = input.required<ElementsList[]>();
  assignedElements = input.required<ElementsList[]>();

  availableElements = signal<ElementsList[]>([]);
  assignedList = signal<ElementsList[]>([]);

  assignedListReturn = output<ElementsList[]>();

  readonly selectedAvailableId = signal<number | null>(null);
  readonly selectedAssignedId = signal<number | null>(null);

  readonly canAssign = computed(() => this.selectedAvailableId() !== null);
  readonly canRemove = computed(() => this.selectedAssignedId() !== null);

  constructor() {
    effect(() => {
      const assigned = this.assignedElements();
      const all = this.allElements();

      this.assignedList.set([...assigned]);
      this.availableElements.set(
        all.filter((item) => !assigned.some((assignedItem) => assignedItem.id === item.id))
      );
    });
  }

  selectAvailable(elementId: number): void {
    this.selectedAvailableId.set(elementId);
    this.selectedAssignedId.set(null);
  }

  selectAssigned(elementId: number): void {
    this.selectedAssignedId.set(elementId);
    this.selectedAvailableId.set(null);
  }

  assignElement(): void {
    const elementId = this.selectedAvailableId();
    const element = this.availableElements().find((item) => item.id === elementId);

    if (!element) {
      return;
    }

    this.assignedList.update((items) => [...items, element]);
    this.availableElements.update((items) => items.filter((item) => item.id !== element.id));
    this.selectedAvailableId.set(null);
    this.returnElements();
  }

  removeElement(): void {
    const elementId = this.selectedAssignedId();
    const element = this.assignedList().find((item) => item.id === elementId);

    if (!element) {
      return;
    }

    this.assignedList.update((items) => items.filter((item) => item.id !== element.id));
    this.availableElements.update((items) => [...items, element]);
    this.selectedAssignedId.set(null);
    this.returnElements();
  }

  returnElements():void{
    this.assignedListReturn.emit(this.assignedList());
  }
}
