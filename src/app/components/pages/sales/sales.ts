import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface SaleItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface SaleTab {
  id: number;
  title: string;
  customer: string;
  items: SaleItem[];
}

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {
  protected readonly saleTabs = signal<SaleTab[]>([
    {
      id: 1,
      title: 'Venta 1',
      customer: 'Mostrador',
      items: [
        { name: 'Concha Vainilla', quantity: 4, unitPrice: 12 },
        { name: 'Bolillo Tradicional', quantity: 6, unitPrice: 3 },
      ],
    },
    {
      id: 2,
      title: 'Venta 2',
      customer: 'Cafeteria Norte',
      items: [
        { name: 'Cuernito Mantequilla', quantity: 10, unitPrice: 9 },
      ],
    },
  ]);

  protected readonly activeTabId = signal(1);
  private readonly nextTabId = signal(3);

  protected readonly activeTab = computed(() => {
    const activeId = this.activeTabId();
    return this.saleTabs().find((tab) => tab.id === activeId) ?? this.saleTabs()[0];
  });

  protected readonly activeTabTotal = computed(() => {
    const tab = this.activeTab();
    if (!tab) {
      return 0;
    }

    return tab.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  });

  protected selectTab(tabId: number): void {
    this.activeTabId.set(tabId);
  }

  protected createTab(): void {
    const id = this.nextTabId();
    const newTab: SaleTab = {
      id,
      title: `Venta ${id}`,
      customer: 'Cliente nuevo',
      items: [],
    };

    this.saleTabs.update((tabs) => [...tabs, newTab]);
    this.activeTabId.set(id);
    this.nextTabId.update((current) => current + 1);
  }

  protected closeTab(tabId: number): void {
    const tabs = this.saleTabs();
    if (tabs.length === 1) {
      return;
    }

    const indexToRemove = tabs.findIndex((tab) => tab.id === tabId);
    if (indexToRemove < 0) {
      return;
    }

    const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
    this.saleTabs.set(remainingTabs);

    if (this.activeTabId() !== tabId) {
      return;
    }

    const fallbackIndex = Math.max(0, indexToRemove - 1);
    this.activeTabId.set(remainingTabs[fallbackIndex].id);
  }

  protected saleTotal(tab: SaleTab): number {
    return tab.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }
}
