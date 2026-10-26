declare module 'flowbite-datepicker/Datepicker' {
  export type DatepickerLocale = {
    days: string[];
    daysShort: string[];
    daysMin: string[];
    months: string[];
    monthsShort: string[];
    today: string;
    clear: string;
    titleFormat: string;
    weekStart: number;
    format: string;
  };

  export default class Datepicker {
    static locales: Record<string, DatepickerLocale>;

    constructor(
      element: HTMLElement,
      options?: { autohide?: boolean; format?: string; language?: string; weekStart?: number }
    );

    hide(): void;
    destroy(): this;
  }
}