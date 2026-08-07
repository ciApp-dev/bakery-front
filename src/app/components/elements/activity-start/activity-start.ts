import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectorForm } from "../selectors/selector-form/selector-form";
import { SelectorOption } from 'src/app/interfaces/forms';
import { environment } from '@environments/environment';
import { NewActivity } from "./new-activity/new-activity";
import { JoinActivity } from "./join-activity/join-activity";


type ActivityOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-activity-start',
  imports: [ReactiveFormsModule, SelectorForm, NewActivity, JoinActivity],
  templateUrl: './activity-start.html',
  styleUrl: './activity-start.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class ActivityStartComponent {
  private readonly formBuilder = inject(FormBuilder);

  darkModeDiv = environment.darkModeDiv;


  optionsActivity = input<SelectorOption[]>([
    { id: 1, nombre: 'Iniciar Actividad' },
    { id: 2, nombre: 'Seleccionar Actividad' },
  ]);

  activitySelected = signal<number | null>(null);

  readonly isOpen = input(false);
  readonly title = input('Iniciar Actividad');
  readonly subtitle = input('Selecciona la actividad e ingresa el identificador para comenzar.');
  readonly closeOnBackdrop = input(true);
  readonly activityPlaceholder = input('Selecciona una actividad');
  readonly inputLabel = input('Referencia');
  readonly inputPlaceholder = input('Ej. FOLIO-001');
  readonly options = input<readonly ActivityOption[]>([]);

  readonly start = output<{ activity: string; reference: string }>();
  readonly cancel = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    activity: ['', Validators.required],
    reference: ['', Validators.required],
  });


  onActivityChange(value: number): void {
    const parsedValue = value >0 ? value : null;
    this.activitySelected.set(parsedValue);
  }
  onBackdropClick(): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    this.onCancel();
  }

  onCancel(): void {
    this.form.reset();
    this.activitySelected.set(null);
    this.cancel.emit();
  }

  onActivityTaskCompleted(): void {
    this.onCancel();
  }

  onEscape(): void {
    if (!this.isOpen()) {
      return;
    }

    this.onCancel();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { activity, reference } = this.form.getRawValue();
    this.start.emit({
      activity,
      reference: reference.trim(),
    });
  }
}
