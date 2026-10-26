import { Component } from '@angular/core';

@Component({
  selector: 'app-report-profile',
  template: '<section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile report</h1></section>',
})
export class ReportProfileComponent {}

@Component({
  selector: 'app-report-dashboard',
  template: '<section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard report</h1></section>',
})
export class ReportDashboardComponent {}

@Component({
  selector: 'app-report-settings',
  template: '<section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings report</h1></section>',
})
export class ReportSettingsComponent {}

@Component({
  selector: 'app-report-invoice',
  template: '<section class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Invoice report</h1></section>',
})
export class ReportInvoiceComponent {}