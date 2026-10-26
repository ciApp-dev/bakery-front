import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReportTabs } from 'src/app/interfaces/reports-interfaces';

@Component({
  selector: 'app-reports',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class ReportsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly navTabs: ReportTabs[] = [
    {path: 'sales', label: 'Ventas'},
    {path: 'sales-detail', label: 'Detalle de ventas'},
    {path: 'cash-movement', label: 'Movimiento de cajas'},
    {path: 'inventory-movement', label: 'Movimiento de inventario'}
  ];

  onTabChange(event: Event): void {
    const path = (event.target as HTMLSelectElement).value;
    this.router.navigate([path], { relativeTo: this.route });
  }

}
