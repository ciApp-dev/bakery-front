import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type DashboardSection = 'overview' | 'sales' | 'inventory' | 'orders' | 'customers' | 'reports';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponents {
  readonly isSidebarOpen = signal(false);
  readonly selectedSection = signal<DashboardSection>('overview');

  readonly selectedSectionLabel = () => {
    const labels: Record<DashboardSection, string> = {
      overview: 'Resumen General',
      sales: 'Ventas',
      inventory: 'Inventario',
      orders: 'Pedidos',
      customers: 'Clientes',
      reports: 'Reportes',
    };

    return labels[this.selectedSection()];
  };

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  selectSection(section: DashboardSection): void {
    this.selectedSection.set(section);

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.closeSidebar();
    }
  }

  isSectionSelected(section: DashboardSection): boolean {
    return this.selectedSection() === section;
  }
}
