import { Component, computed, inject, signal } from '@angular/core';
import { SalesService } from 'src/app/service/sales-service';
import { DatepickerInput } from 'src/app/components/elements/datepicker/datepicker-input/datepicker-input';
import { ContentLabelTable, ElementsList, SelectorOption } from 'src/app/interfaces/forms';
import { SucursalesService } from 'src/app/service/sucursales-service';
import { SelectorForm } from 'src/app/components/elements/selectors/selector-form/selector-form';
import { PaymentsService } from 'src/app/service/payments-service';
import { statusRequest } from 'src/app/interfaces/request';
import { UsersService } from 'src/app/service/users-service';
import { ButtonMainForm } from 'src/app/components/elements/buttons/button-main-form/button-main-form';
import { CustomersService } from 'src/app/service/customers-service';
import { TableStatus } from 'src/app/components/elements/tables/table-status/table-status';
import { SalesReportResponse, SalesReportRow } from 'src/app/interfaces/reports-interfaces';

@Component({
  selector: 'app-sales-reports',
  imports: [DatepickerInput, SelectorForm, ButtonMainForm, TableStatus],
  templateUrl: './sales-reports.html',
  styleUrl: './sales-reports.css',
})
export class SalesReportsComponent {

  branchesService = inject(SucursalesService);
  userService = inject(UsersService);
  customerService = inject(CustomersService);
  salesService = inject(SalesService);

  readonly startDate = signal('');
  readonly endDate = signal('');
  selectedBranch = signal<number>(0);
  readonly selectedPayment = signal('Todos');
  readonly selectedStatus = signal<number>(0);
  readonly selectedUser = signal<number>(0);
  readonly selectedCustomer = signal<number>(0);

  allBranches = signal<SelectorOption[]>([]);
  statusOptions = signal<SelectorOption[]>([
    { id: 0, nombre: 'Todas' },
    { id: 1, nombre: 'Activas' },
    { id: 2, nombre: 'Cancelada' },
    { id: 3, nombre: 'Consolidada' }
  ]);
  userOptions = signal<SelectorOption[]>([]);
  customerOptions = signal<SelectorOption[]>([]);


  salesContent(): SalesReportRow[] {
    return this.allSales();
  }

  allSales = signal<SalesReportRow[]>([]);
  salesContentLabel: ContentLabelTable[] = [
    {id:1, name: 'Folio', key: 'id' },
    {id:2, name: 'Sucursal', key: 'sucursal' },
    {id:3, name: 'Vendedor', key: 'vendedor' },
    {id:4, name: 'Cliente', key: 'cliente' },
    {id:5, name: 'Total', key: 'total' },
    {id:6, name: 'Pago', key: 'pago' },
    {id:7, name: 'Cambio', key: 'cambio' },
    {id:8, name: 'Comentarios', key: 'comentarios' },
    {id:9, name: 'Fecha', key: 'fecha' },
    {id:10, name: 'Estado', key: 'estado' },
  ];

  constructor() {
    this.getBranchOptions();
    this.getUserOptions();
    this.getCustomerOptions();
  }

  setStartDate(value: string): void {
    this.startDate.set(value);
  }

  setEndDate(value: string): void {
    this.endDate.set(value);
  }

  setBranch(value: number): void {
    const branchId = value ?? 0;
    this.selectedBranch.set(branchId);
  }

  setStatus(value: number): void {
    this.selectedStatus.set(value ?? 0);
  }

  setUser(value: number): void {
    this.selectedUser.set(value ?? 0);
  }

  setCustomer(value: number): void {
    this.selectedCustomer.set(value ?? 0);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  downloadExcel(): void {

    const filter= {
      fecha_desde: this.startDate(),
      fecha_hasta: this.endDate(),
      sucursal_id: this.selectedBranch(),
      user_id: this.selectedUser(),
      cliente_id: this.selectedCustomer(),
      estado: this.selectedStatus() === 0 ? '*' : this.selectedStatus() === 1 ? 'ACT' : this.selectedStatus() === 2 ? 'CAN' : ''
    }
   this.salesService.getExcel(filter).subscribe({
     next: (blob) => {
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'ventas.xlsx';
       a.click();
       window.URL.revokeObjectURL(url);
     },
     error: (err) => {
       console.error('Error downloading Excel:', err);
     }
   });
  }

  getsalesContent(): void {
    this.getSales();
  }

  getBranchOptions(): void {
    const estado = {estado: 'ACT'};
    this.branchesService.getSucursales(estado).subscribe({
      next: (branches) => {
        this.allBranches.set([{ id: 0, nombre: 'Todas' }, ...branches.map(branch => ({ id: branch.id, nombre: branch.nombre }))]);
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
        this.allBranches.set([]);
      }
    });
  
  }


    getUserOptions(): void {
      const estado='ACT';
      this.userService.getUsers(estado).subscribe({
        next: (users) => {
          this.userOptions.set([{ id: 0, nombre: 'Todos' }, ...users.map(user => ({ id: user.id, nombre: user.name }))]);
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.userOptions.set([]);
        }
      });
    }

    getCustomerOptions(): void {
      const estado: statusRequest = { estado: 'ACT' };
      this.customerService.getCustomers(estado).subscribe({
        next: (customers) => {
          this.customerOptions.set([{ id: 0, nombre: 'Todos' }, ...customers.map(customer => ({ id: customer.id ?? 0, nombre: customer.nombre }))]);
        },
        error: (err) => {
          console.error('Error fetching customers:', err);
          this.customerOptions.set([]);
        }
      });
    }

    getSales(): void {
      const filters = {
        fecha_desde: this.startDate(),
        fecha_hasta: this.endDate(),
        sucursal_id: this.selectedBranch(),
        user_id: this.selectedUser(),
        cliente_id: this.selectedCustomer(),
        estado: this.selectedStatus() === 0 ? '*': this.selectedStatus() === 1 ? 'ACT' : this.selectedStatus() === 2 ? 'CAN' : ''
      };
      this.salesService.getSales(filters).subscribe({
        next: (response: SalesReportResponse) => {
          this.allSales.set(response.data.map(sale => ({
            id: sale.id,
            fecha: sale.created_at.slice(0, 10),
            sucursal: sale.sucursal?.nombre ?? '',
            vendedor: sale.user?.name ?? '',
            cliente: sale.cliente ? `${sale.cliente.nombre} ${sale.cliente.apellido ?? ''}`.trim() : '',
            total: sale.total,
            pago: sale.recibido ?? 0,
            cambio: sale.cambio ?? 0,
            comentarios: sale.comentarios ?? '',
            estado: sale.estado ?? '',
          })));
        },
        error: (err) => {
          console.error('Error fetching sales:', err);
          this.allSales.set([]);
        }
      });
    }


}
