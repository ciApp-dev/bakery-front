import { Component } from '@angular/core';
import { DatepickerInput } from "src/app/components/elements/datepicker/datepicker-input/datepicker-input";

@Component({
  selector: 'app-entrance-register',
  imports: [DatepickerInput],
  templateUrl: './entrance-register.html',
  styleUrl: './entrance-register.css',
})
export class EntranceRegister {}
