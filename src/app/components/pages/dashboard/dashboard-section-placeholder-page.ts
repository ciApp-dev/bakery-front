import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-section-placeholder-page',
  template: `
    <section class="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      <h3 class="text-lg font-bold text-slate-900">{{ title() }}</h3>
      <p class="mt-2 text-sm text-slate-500">{{ description() }}</p>
      <div class="mt-4 grid min-h-72 place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center">
        <p class="text-sm font-semibold text-slate-500">{{ placeholder() }}</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSectionPlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  readonly title = computed(() => (this.route.snapshot.data['title'] as string | undefined) ?? 'Seccion');
  readonly description = computed(() => (this.route.snapshot.data['description'] as string | undefined) ?? 'Inserta aqui tu pantalla.');
  readonly placeholder = computed(() => (this.route.snapshot.data['placeholder'] as string | undefined) ?? 'Area lista para tu componente.');
}