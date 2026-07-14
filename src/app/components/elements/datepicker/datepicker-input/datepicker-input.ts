import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

declare global {
  interface Window {
    initFlowbite?: () => void;
    Datepicker?: new (
      element: HTMLElement,
      options?: { autohide?: boolean; format?: string }
    ) => unknown;
  }
}

@Component({
  selector: 'app-datepicker-input',
  imports: [],
  templateUrl: './datepicker-input.html',
  styleUrl: './datepicker-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerInput implements AfterViewInit {
  @ViewChild('dateInput', { static: true })
  private readonly dateInput?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    const inputElement = this.dateInput?.nativeElement;

    if (!inputElement) {
      return;
    }

    if (window.Datepicker) {
      new window.Datepicker(inputElement, {
        autohide: true,
        format: 'yyyy-mm-dd',
      });
      return;
    }

    window.initFlowbite?.();
  }
}
