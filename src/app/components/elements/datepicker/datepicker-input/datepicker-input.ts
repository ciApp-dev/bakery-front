import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, output, ViewChild } from '@angular/core';
import Datepicker from 'flowbite-datepicker/Datepicker';


@Component({
  selector: 'app-datepicker-input',
  imports: [],
  templateUrl: './datepicker-input.html',
  styleUrl: './datepicker-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerInput implements AfterViewInit, OnDestroy {
  readonly dateChange = output<string>();
  private datepickerInstance?: Datepicker;

  @ViewChild('dateInput', { static: true })
  private readonly dateInput?: ElementRef<HTMLInputElement>;

  private readonly handleDateChange = (): void => {
    const [day, month, year] = (this.dateInput?.nativeElement.value ?? '').split('/');
    const isoDate = day && month && year
      ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      : '';

    this.dateChange.emit(isoDate);
    this.datepickerInstance?.hide();
  };

  ngAfterViewInit(): void {
    const inputElement = this.dateInput?.nativeElement;

    if (!inputElement) {
      return;
    }

    inputElement.addEventListener('changeDate', this.handleDateChange);

    Datepicker.locales['es'] = {
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      titleFormat: 'MM y',
      weekStart: 1,
      format: 'dd/mm/yyyy',
    };

    this.datepickerInstance = new Datepicker(inputElement, {
      autohide: true,
      format: 'dd/mm/yyyy',
      language: 'es',
      weekStart: 1,
    });
  }

  ngOnDestroy(): void {
    this.dateInput?.nativeElement.removeEventListener('changeDate', this.handleDateChange);
    this.datepickerInstance?.destroy();
  }
}
